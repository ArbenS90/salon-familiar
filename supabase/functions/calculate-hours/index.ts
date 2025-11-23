import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalculateHoursRequest {
  user_id?: string
  fecha_inicio: string
  fecha_fin: string
  periodo: 'dia' | 'semana' | 'mes'
}

serve(async (req) => {
  // Manejar CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Obtener token de autorización
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crear cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verificar usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obtener rol del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parsear request body
    const body: CalculateHoursRequest = await req.json()
    const { user_id, fecha_inicio, fecha_fin, periodo } = body

    // Determinar user_id objetivo
    const targetUserId = user_id || user.id

    // Validar permisos: solo ADMIN/SUPER_ADMIN pueden ver otros usuarios
    if (targetUserId !== user.id && !['ADMIN', 'SUPER_ADMIN'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obtener fichajes en el rango de fechas
    const { data: fichajes, error: fichajesError } = await supabase
      .from('fichajes')
      .select('*')
      .eq('user_id', targetUserId)
      .gte('started_at', fecha_inicio)
      .lte('started_at', fecha_fin)
      .order('started_at', { ascending: true })

    if (fichajesError) {
      return new Response(
        JSON.stringify({ error: fichajesError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calcular horas trabajadas
    let totalHoras = 0
    let entradaActual: any = null
    const periodos: Record<string, number> = {}

    for (const fichaje of fichajes || []) {
      const fecha = new Date(fichaje.started_at).toISOString().split('T')[0]

      if (fichaje.tipo === 'ENTRADA') {
        entradaActual = fichaje
      } else if (fichaje.tipo === 'SALIDA' && entradaActual) {
        const inicio = new Date(entradaActual.started_at).getTime()
        const fin = fichaje.ended_at 
          ? new Date(fichaje.ended_at).getTime() 
          : new Date(fichaje.started_at).getTime()
        
        let horasTrabajadas = (fin - inicio) / (1000 * 60 * 60)

        // Descontar pausas y descansos en este período
        const pausas = fichajes.filter((p: any) => 
          p.tipo === 'PAUSA' || p.tipo === 'DESCANSO'
        ).filter((p: any) => {
          const pInicio = new Date(p.started_at).getTime()
          const pFin = p.ended_at ? new Date(p.ended_at).getTime() : Date.now()
          return pInicio >= inicio && pFin <= fin
        })

        for (const pausa of pausas) {
          const pInicio = new Date(pausa.started_at).getTime()
          const pFin = pausa.ended_at 
            ? new Date(pausa.ended_at).getTime() 
            : Date.now()
          horasTrabajadas -= (pFin - pInicio) / (1000 * 60 * 60)
        }

        if (horasTrabajadas > 0) {
          totalHoras += horasTrabajadas
          
          // Agrupar por período según el parámetro
          if (periodo === 'dia') {
            periodos[fecha] = (periodos[fecha] || 0) + horasTrabajadas
          } else if (periodo === 'semana') {
            const semana = getWeekNumber(new Date(fichaje.started_at))
            const key = `Semana ${semana}`
            periodos[key] = (periodos[key] || 0) + horasTrabajadas
          } else if (periodo === 'mes') {
            const mes = new Date(fichaje.started_at).toLocaleString('es-ES', { month: 'long', year: 'numeric' })
            periodos[mes] = (periodos[mes] || 0) + horasTrabajadas
          }
        }

        entradaActual = null
      }
    }

    // Formatear resultado
    const resultado = {
      user_id: targetUserId,
      fecha_inicio,
      fecha_fin,
      periodo,
      total_horas: Math.round(totalHoras * 100) / 100,
      horas_formateadas: formatHoras(totalHoras),
      desglose: periodos
    }

    return new Response(
      JSON.stringify(resultado),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function formatHoras(horas: number): string {
  const horasEnteras = Math.floor(horas)
  const minutos = Math.round((horas - horasEnteras) * 60)
  return `${horasEnteras}h ${minutos}m`
}

