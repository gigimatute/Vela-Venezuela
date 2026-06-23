import { useState, useReducer, useEffect } from "react";

const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`;

const T = {
  bgBase:    "#F0FDF9",
  bgSurface: "#FFFFFF",
  bgMuted:   "#F0FDF9",
  bgSubtle:  "#DCFCE7",
  primary:   "#059669",
  primaryDk: "#047857",
  primaryLt: "#D1FAE5",
  gold:      "#D97706",
  goldLt:    "#FEF3C7",
  textHd:    "#064E3B",
  textBody:  "#065F46",
  textMuted: "#6EE7B7",
  textGray:  "#9CA3AF",
  white:     "#FFFFFF",
  rose:      "#EC4899",
};

const F = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  h1:   { fontSize: 28, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" },
  h2:   { fontSize: 20, fontWeight: 700, lineHeight: 1.2,  letterSpacing: "-0.01em" },
  h3:   { fontSize: 16, fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.65 },
  sm:   { fontSize: 12, fontWeight: 400, lineHeight: 1.5 },
  label:{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
};

const S = {
  card: {
    background: T.bgSurface,
    borderRadius: 20,
    padding: "20px",
    marginBottom: 12,
    boxShadow: "0 1px 3px rgba(5,150,105,0.06), 0 4px 16px rgba(5,150,105,0.05)",
    border: `1px solid rgba(167,243,208,0.4)`,
  },
  input: {
    width: "100%",
    background: T.bgMuted,
    border: `1.5px solid ${T.primaryLt}`,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    color: T.textHd,
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    background: T.bgMuted,
    border: `1.5px solid ${T.primaryLt}`,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    color: T.textHd,
    outline: "none",
    appearance: "none",
  },
  btnPrimary: {
    width: "100%",
    background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDk} 100%)`,
    color: T.white,
    border: "none",
    borderRadius: 14,
    padding: "15px 24px",
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
    transition: "all 0.2s",
  },
  btnGold: {
    width: "100%",
    background: `linear-gradient(135deg, ${T.gold} 0%, #B45309 100%)`,
    color: T.white,
    border: "none",
    borderRadius: 14,
    padding: "15px 24px",
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(217,119,6,0.3)",
    transition: "all 0.2s",
  },
  btnSecondary: (active = false) => ({
    background: active ? T.primaryLt : T.bgMuted,
    color: active ? T.primary : T.textBody,
    border: `1.5px solid ${active ? T.primary : "transparent"}`,
    borderRadius: 22,
    padding: "8px 14px",
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.18s",
  }),
};

// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────
function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function lsClear(key) {
  try { localStorage.removeItem(key); } catch {}
}

// ─── RESPUESTAS DE IA ─────────────────────────────────────────────────────────
const SINTOMAS = {
  fiebre: {
    keywords: ["fiebre", "temperatura", "calentura", "caliente"],
    respuesta: () => `La fiebre es una respuesta natural del cuerpo ante infecciones o inflamaciones. Una temperatura entre 37.5°C y 38.5°C generalmente indica que tu sistema inmune está trabajando.\n\n**Qué puedes hacer:**\n• Toma abundante agua y líquidos\n• Descansa en un lugar fresco\n• Paracetamol (500mg cada 6–8 horas) puede ayudar a bajar la temperatura\n• Compresas de agua tibia en frente y muñecas\n\n**Consulta con un médico si:**\n• La fiebre supera 39°C\n• Dura más de 3 días\n• Tienes dificultad para respirar, dolor muy intenso, o confusión\n\nRecuerda: esta información es orientativa. Para un diagnóstico y tratamiento preciso, agenda una consulta con la Dra. Radhika Lakshmi Lakshmi. 🩺`,
  },
  dolor_cabeza: {
    keywords: ["cabeza", "migraña", "cefalea", "jaqueca", "dolor de cabeza"],
    respuesta: () => `El dolor de cabeza es uno de los síntomas más comunes y tiene muchas causas posibles: tensión muscular, deshidratación, estrés, falta de sueño, o presión arterial alterada.\n\n**Qué puedes hacer:**\n• Bebe al menos 2 litros de agua al día\n• Descansa en un lugar oscuro y silencioso\n• Paracetamol o ibuprofeno pueden aliviar el dolor moderado\n• Evita pantallas por un rato\n\n**Consulta con un médico si:**\n• El dolor es muy intenso o "el peor de tu vida"\n• Viene acompañado de fiebre, rigidez en el cuello, o cambios en la visión\n• Es recurrente (más de 3 veces por semana)\n\nPara una evaluación completa y conocer la causa exacta, la Dra. Radhika Lakshmi Lakshmi puede ayudarte. 🩺`,
  },
  presion: {
    keywords: ["presión", "presion", "hipertensión", "hipertension", "tensión", "tension", "mareo", "mareado"],
    respuesta: () => `Los síntomas relacionados con la presión arterial — mareos, dolor de cabeza, visión borrosa, zumbido en los oídos — merecen atención médica oportuna.\n\n**Qué puedes hacer ahora:**\n• Siéntate o recuéstate en un lugar tranquilo\n• Evita la sal, el café y el estrés\n• Si tienes tensiómetro, mide tu presión\n• No hagas esfuerzo físico intenso\n\n**Busca atención médica si:**\n• Tu presión supera 140/90 de forma repetida\n• Tienes dolor en el pecho o dificultad para respirar\n• Los mareos son muy intensos o pierdes el equilibrio\n\nLa hipertensión es una condición que requiere evaluación y seguimiento médico. Te recomendamos agendar una consulta con la Dra. Radhika Lakshmi Lakshmi para un diagnóstico preciso. 🩺`,
  },
  estomago: {
    keywords: ["estómago", "estomago", "náuseas", "nauseas", "vómito", "vomito", "diarrea", "gastro", "colitis", "dolor abdominal", "barriga"],
    respuesta: () => `Los problemas gastrointestinales — náuseas, vómitos, diarrea, dolor abdominal — son muy comunes y generalmente se resuelven en pocos días con cuidados básicos.\n\n**Qué puedes hacer:**\n• Hidratación es lo más importante — agua, suero oral, o agua de coco\n• Dieta blanda: arroz blanco, pollo hervido, plátano, tostadas\n• Evita lácteos, grasas y picantes mientras dure el malestar\n• Reposa\n\n**Consulta con un médico si:**\n• La diarrea o vómitos duran más de 48 horas\n• Hay sangre en las heces o el vómito\n• Dolor abdominal muy intenso y localizado\n• Signos de deshidratación: boca seca, orina oscura, mareos\n\nPara una evaluación completa, agenda con la Dra. Radhika Lakshmi Lakshmi. 🩺`,
  },
  gripe: {
    keywords: ["gripe", "resfriado", "tos", "mocos", "congestión", "congestion", "catarro", "garganta"],
    respuesta: () => `Los síntomas de gripe o resfriado — tos, congestión, dolor de garganta, malestar general — suelen mejorar en 5–7 días con cuidados en casa.\n\n**Qué puedes hacer:**\n• Descansa mucho y toma abundantes líquidos\n• Miel con limón y jengibre puede aliviar la garganta\n• Paracetamol para el malestar y la fiebre\n• Vaporizaciones con agua caliente para la congestión\n• Evita el frío y los cambios bruscos de temperatura\n\n**Consulta con un médico si:**\n• La fiebre supera 39°C o dura más de 3 días\n• Tienes dificultad para respirar o dolor en el pecho\n• Los síntomas empeoran después del día 3\n• Tienes condiciones crónicas como diabetes o asma\n\nSi los síntomas persisten o se complican, la Dra. Radhika Lakshmi Lakshmi puede evaluarte desde casa. 🩺`,
  },
  diabetes: {
    keywords: ["diabetes", "azúcar", "azucar", "glucosa", "insulina", "diabético", "diabetico"],
    respuesta: () => `La diabetes es una condición crónica que requiere seguimiento médico regular, pero con el manejo adecuado se puede vivir muy bien.\n\n**Señales de alerta que debes conocer:**\n• Hipoglucemia (azúcar baja): temblores, sudoración, confusión → toma algo dulce de inmediato\n• Hiperglucemia (azúcar alta): mucha sed, orinar frecuente, visión borrosa → requiere atención\n\n**Hábitos importantes:**\n• Monitorea tu glucosa regularmente si tienes el equipo\n• Mantén horarios regulares de comida\n• Evita azúcares simples y harinas refinadas\n• Haz actividad física moderada\n\n**Para control y ajuste de medicación** es fundamental tener seguimiento médico. La Dra. Radhika Lakshmi puede orientarte en el manejo de tu diabetes. 🩺`,
  },
};

function getRespuesta(texto) {
  const lower = texto.toLowerCase();
  for (const [, data] of Object.entries(SINTOMAS)) {
    if (data.keywords.some(k => lower.includes(k))) {
      return data.respuesta();
    }
  }
  return `Gracias por compartir cómo te sientes. Los síntomas que describes merecen atención médica personalizada para darte una orientación precisa.\n\nComo información general:\n• Mantente bien hidratado/a\n• Descansa lo que necesites\n• Observa si los síntomas mejoran, se mantienen o empeoran\n\nSin embargo, para un diagnóstico certero y orientación específica a tu caso, lo más recomendable es una consulta médica. La Dra. Radhika Lakshmi puede evaluarte desde la comodidad de tu hogar por solo $25.\n\n¿Deseas agendar una consulta? 🩺`;
}

function simular(ms = 1200) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── STATE ────────────────────────────────────────────────────────────────────
const init = { perfil: null, consultas: [], sintomas: [] };
function reducer(s, a) {
  switch (a.type) {
    case "LOAD":         return { ...s, ...a.payload };
    case "SET_PERFIL":   return { ...s, perfil: a.payload };
    case "ADD_CONSULTA": return { ...s, consultas: [a.payload, ...s.consultas] };
    case "ADD_SINTOMA":  return { ...s, sintomas: [a.payload, ...s.sintomas] };
    default:             return s;
  }
}

// ─── COMPONENTES ──────────────────────────────────────────────────────────────
function Aviso() {
  return (
    <div style={{ background: T.primaryLt, border: `1px solid ${T.primary}33`, borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>🛡️</span>
      <p style={{ ...F.sm, fontFamily: F.family, color: T.primaryDk, margin: 0, lineHeight: 1.5 }}>
        <strong>Vela no reemplaza al médico.</strong> Ofrecemos información general y orientación. Para diagnósticos, prescripciones y tratamientos, consulta con la Dra. Radhika Lakshmi Lakshmi.
      </p>
    </div>
  );
}

function Cargando({ texto }) {
  return (
    <div style={{ textAlign: "center", padding: "28px 0" }}>
      <style>{`@keyframes db{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}`}</style>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: T.primary, animation: `db 1.3s ease-in-out ${i*0.16}s infinite` }}/>)}
      </div>
      <p style={{ ...F.sm, fontFamily: F.family, color: T.textGray, fontStyle: "italic" }}>{texto}</p>
    </div>
  );
}

function Etiqueta({ texto, color = T.primaryLt, textColor = T.primary }) {
  return <span style={{ background: color, color: textColor, borderRadius: 20, padding: "4px 11px", ...F.sm, fontFamily: F.family, fontWeight: 600, display: "inline-block" }}>{texto}</span>;
}

function TabBar({ activa, onChange }) {
  const tabs = [
    { id:"inicio", icon:"🏠", label:"Inicio" },
    { id:"consultar", icon:"💬", label:"Consultar" },
    { id:"cita", icon:"🩺", label:"Cita" },
    { id:"perfil", icon:"👤", label:"Mi Perfil" },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: T.bgSurface, borderTop: `1px solid ${T.primaryLt}`, display: "flex", zIndex: 200, boxShadow: "0 -4px 24px rgba(5,150,105,0.08)" }}>
      {tabs.map(t => {
        const on = activa === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, border: "none", background: "transparent", padding: "11px 0 13px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}>
            {on && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 32, height: 3, borderRadius: "0 0 3px 3px", background: `linear-gradient(90deg, ${T.primary}, ${T.primaryDk})` }}/>}
            <span style={{ fontSize: 19 }}>{t.icon}</span>
            <span style={{ ...F.sm, fontFamily: F.family, fontWeight: on ? 700 : 400, color: on ? T.primary : T.textGray }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [paso, setPaso] = useState(0);
  const [data, setData] = useState({});
  const pasos = [
    {
      titulo: "Bienvenido/a a Vela",
      sub: "Tu salud, desde la comodidad de tu hogar",
      campos: [
        { key:"nombre", label:"¿Cómo te llamas?", tipo:"text", ph:"Tu nombre" },
        { key:"edad", label:"Edad", tipo:"number", ph:"ej. 35" },
        { key:"sexo", label:"Sexo biológico", tipo:"select", opts:["Femenino","Masculino","Prefiero no decir"] },
      ]
    },
    {
      titulo: "Tu salud",
      sub: "Para orientarte mejor",
      campos: [
        { key:"ciudad", label:"¿En qué ciudad estás?", tipo:"text", ph:"ej. Caracas, Maracaibo, Valencia..." },
        { key:"condiciones", label:"¿Tienes alguna condición crónica? (opcional)", tipo:"textarea", ph:"ej. Diabetes, hipertensión, asma... o escribe 'ninguna'" },
        { key:"medicamentos", label:"¿Tomas algún medicamento? (opcional)", tipo:"textarea", ph:"ej. Metformina, Losartán... o escribe 'ninguno'" },
      ]
    },
  ];

  const cur = pasos[paso];
  const progress = ((paso + 1) / pasos.length) * 100;

  function campo(key, val) { setData(p => ({ ...p, [key]: val })); }

  function siguiente() {
    if (paso < pasos.length - 1) { setPaso(p => p + 1); return; }
    onComplete({ ...data, creadoEn: new Date().toISOString() });
  }

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${T.bgSubtle} 0%, ${T.bgBase} 55%)`, padding:"0 20px 48px", fontFamily: F.family }}>
      <style>{FONT_LINK}</style>
      <div style={{ paddingTop:64, paddingBottom:36, textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:26, background:`linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDk} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", boxShadow:"0 8px 24px rgba(5,150,105,0.3)", fontSize:40 }}>🕯️</div>
        <h1 style={{ ...F.h1, fontFamily:F.family, color:T.textHd, margin:"0 0 4px" }}>Vela Salud</h1>
        <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:"0 0 4px" }}>Información médica confiable</p>
        <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray }}>y consultas con médicos reales, desde tu casa</p>
      </div>

      <div style={{ height:4, background:T.primaryLt, borderRadius:4, marginBottom:28 }}>
        <div style={{ height:4, borderRadius:4, width:`${progress}%`, background:`linear-gradient(90deg, ${T.primary}, ${T.primaryDk})`, transition:"width 0.4s ease" }}/>
      </div>

      <div style={S.card}>
        <p style={{ ...F.label, fontFamily:F.family, color:T.textGray, marginBottom:6 }}>Paso {paso+1} de {pasos.length}</p>
        <h2 style={{ ...F.h2, fontFamily:F.family, color:T.textHd, margin:"0 0 4px" }}>{cur.titulo}</h2>
        <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:"0 0 22px" }}>{cur.sub}</p>
        {cur.campos.map(f => (
          <div key={f.key} style={{ marginBottom:16 }}>
            <label style={{ ...F.label, fontFamily:F.family, color:T.textGray, display:"block", marginBottom:6 }}>{f.label}</label>
            {f.tipo==="select"
              ? <select style={S.select} value={data[f.key]||""} onChange={e=>campo(f.key,e.target.value)}><option value="">Selecciona…</option>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
              : f.tipo==="textarea"
              ? <textarea style={{...S.input,height:80,resize:"none"}} placeholder={f.ph} value={data[f.key]||""} onChange={e=>campo(f.key,e.target.value)}/>
              : <input style={S.input} type={f.tipo} placeholder={f.ph} value={data[f.key]||""} onChange={e=>campo(f.key,e.target.value)}/>
            }
          </div>
        ))}
      </div>

      <button style={S.btnPrimary} onClick={siguiente}>
        {paso < pasos.length-1 ? "Continuar →" : "Comenzar con Vela 🕯️"}
      </button>

      <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray, textAlign:"center", marginTop:20, lineHeight:1.6 }}>
        🛡️ Vela <strong>no es un servicio de emergencias</strong>. En caso de emergencia llama al 911 o acude al hospital más cercano.
      </p>
    </div>
  );
}

// ─── INICIO ───────────────────────────────────────────────────────────────────
function Inicio({ perfil, onNavegar }) {
  const nombre = perfil?.nombre?.split(" ")[0] || "";
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  const servicios = [
    { icon:"💬", titulo:"Consultar síntomas", sub:"Información general gratuita", color:T.primaryLt, tab:"consultar" },
    { icon:"🩺", titulo:"Agendar consulta", sub:"Con la Dra. Radhika Lakshmi Lakshmi · $25", color:T.goldLt, tab:"cita" },
  ];

  const info = [
    { icon:"💧", titulo:"Hidratación", texto:"Toma al menos 8 vasos de agua al día. Es fundamental para casi todos los procesos del cuerpo." },
    { icon:"😴", titulo:"Sueño reparador", texto:"Dormir 7–8 horas reduce el riesgo de hipertensión, diabetes y problemas inmunológicos." },
    { icon:"🥗", titulo:"Alimentación", texto:"Incluye vegetales, proteínas y reduce el azúcar y la sal. Pequeños cambios hacen gran diferencia." },
    { icon:"🚶", titulo:"Actividad física", texto:"30 minutos de caminata al día mejoran el estado de ánimo, la presión arterial y el control del peso." },
  ];

  return (
    <div style={{ fontFamily:F.family }}>
      <style>{FONT_LINK}</style>
      <div style={{ background:`linear-gradient(145deg, ${T.bgSubtle} 0%, #ECFDF5 100%)`, padding:"56px 20px 28px", borderRadius:"0 0 32px 32px", marginBottom:18 }}>
        <p style={{ ...F.sm, fontFamily:F.family, color:T.primary, marginBottom:4, fontWeight:600 }}>
          {new Date().toLocaleDateString("es-VE",{weekday:"long",day:"numeric",month:"long"})}
        </p>
        <h1 style={{ ...F.h1, fontFamily:F.family, color:T.textHd, marginBottom:6 }}>
          {saludo}{nombre ? `, ${nombre}` : ""} 🕯️
        </h1>
        <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:0 }}>
          ¿Cómo te sientes hoy? Estamos aquí para orientarte.
        </p>
      </div>

      <div style={{ padding:"0 16px" }}>
        <Aviso/>

        {/* Servicios */}
        <p style={{ ...F.label, fontFamily:F.family, color:T.textGray, marginBottom:10 }}>¿Qué necesitas hoy?</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
          {servicios.map(s => (
            <button key={s.tab} onClick={() => onNavegar(s.tab)} style={{ background:s.color, border:"none", borderRadius:18, padding:"18px 14px", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <p style={{ ...F.h3, fontFamily:F.family, color:T.textHd, margin:"0 0 4px", fontSize:14 }}>{s.titulo}</p>
              <p style={{ ...F.sm, fontFamily:F.family, color:T.textBody, margin:0 }}>{s.sub}</p>
            </button>
          ))}
        </div>

        {/* Doctora */}
        <div style={{ ...S.card, background:`linear-gradient(135deg, ${T.bgSubtle}, #ECFDF5)`, border:`1px solid ${T.primaryLt}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:18, background:`linear-gradient(135deg, ${T.primary}, ${T.primaryDk})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>👩‍⚕️</div>
            <div>
              <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:2 }}>Médico de cabecera</p>
              <p style={{ ...F.h3, fontFamily:F.family, color:T.textHd, margin:"0 0 2px" }}>Dra. Radhika Lakshmi</p>
              <p style={{ ...F.sm, fontFamily:F.family, color:T.textBody }}>Medicina Interna · Consulta virtual</p>
            </div>
          </div>
          <button onClick={() => onNavegar("cita")} style={{ ...S.btnPrimary, marginTop:14 }}>
            Agendar consulta →
          </button>
        </div>

        {/* Tips de salud */}
        <p style={{ ...F.label, fontFamily:F.family, color:T.textGray, marginBottom:10, marginTop:6 }}>Salud del día</p>
        {info.map((i,idx) => (
          <div key={idx} style={{ ...S.card, display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ fontSize:26, flexShrink:0 }}>{i.icon}</div>
            <div>
              <p style={{ ...F.h3, fontFamily:F.family, color:T.textHd, margin:"0 0 4px", fontSize:14 }}>{i.titulo}</p>
              <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:0, fontSize:13 }}>{i.texto}</p>
            </div>
          </div>
        ))}

        {/* Emergencias */}
        <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:14, padding:16, marginBottom:14 }}>
          <p style={{ ...F.sm, fontFamily:F.family, color:"#991B1B", margin:0, lineHeight:1.6, fontWeight:600 }}>
            🚨 <strong>¿Es una emergencia?</strong> Vela no atiende emergencias médicas. Llama al <strong>911</strong> o acude al hospital más cercano de inmediato.
          </p>
        </div>

        <div style={{ height:100 }}/>
      </div>
    </div>
  );
}

// ─── CONSULTAR ────────────────────────────────────────────────────────────────
function Consultar({ perfil, state, dispatch, onNavegar }) {
  const { sintomas } = state;
  const [texto, setTexto] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  const COMUNES = ["Fiebre","Dolor de cabeza","Presión alta","Náuseas / Vómitos","Tos / Gripe","Diabetes","Dolor de estómago","Mareos"];

  async function consultar() {
    if (!texto.trim()) return;
    setCargando(true); setRespuesta("");
    await simular(1300);
    const resp = getRespuesta(texto);
    setRespuesta(resp);
    const entrada = { sintoma: texto, respuesta: resp, fecha: new Date().toLocaleDateString("es-VE"), ts: new Date().toISOString() };
    dispatch({ type:"ADD_SINTOMA", payload:entrada });
    lsSet("vela:sintomas", [entrada, ...sintomas]);
    setCargando(false);
  }

  return (
    <div style={{ fontFamily:F.family }}>
      <style>{FONT_LINK}</style>
      <div style={{ background:`linear-gradient(145deg, ${T.bgSubtle} 0%, #ECFDF5 100%)`, padding:"56px 20px 24px", borderRadius:"0 0 32px 32px", marginBottom:18 }}>
        <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:6 }}>Gratis</p>
        <h1 style={{ ...F.h1, fontFamily:F.family, color:T.textHd, margin:"0 0 4px" }}>Consultar síntomas</h1>
        <p style={{ ...F.body, fontFamily:F.family, color:T.textBody }}>Cuéntanos cómo te sientes y te orientamos.</p>
      </div>

      <div style={{ padding:"0 16px" }}>
        <Aviso/>

        <div style={S.card}>
          <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:12 }}>Síntomas frecuentes</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:16 }}>
            {COMUNES.map(c => <button key={c} onClick={() => setTexto(c)} style={S.btnSecondary(texto===c)}>{c}</button>)}
          </div>

          <textarea style={{...S.input, height:96, resize:"none", marginBottom:14}}
            placeholder="Describe cómo te sientes… ej: Tengo fiebre desde ayer y dolor de cabeza"
            value={texto} onChange={e => setTexto(e.target.value)}/>

          {cargando
            ? <Cargando texto="Consultando información…"/>
            : <button style={S.btnPrimary} onClick={consultar}>Consultar 🔍</button>
          }

          {respuesta && (
            <div style={{ marginTop:18, background:T.bgMuted, borderRadius:16, padding:18, borderLeft:`4px solid ${T.primary}` }}>
              <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:10 }}>Orientación de Vela</p>
              <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, whiteSpace:"pre-wrap", margin:"0 0 16px" }}>{respuesta}</p>
              <button onClick={() => onNavegar("cita")} style={S.btnGold}>
                🩺 Agendar consulta con la Dra. Radhika Lakshmi Lakshmi — $25
              </button>
            </div>
          )}
        </div>

        {sintomas.length > 0 && (
          <div style={S.card}>
            <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:14 }}>Historial de consultas</p>
            {sintomas.slice(0,5).map((s,i) => (
              <div key={i} style={{ padding:"10px 0", borderBottom:i<Math.min(sintomas.length,5)-1?`1px solid ${T.primaryLt}`:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <p style={{ ...F.h3, fontFamily:F.family, color:T.textHd, margin:0, fontSize:14 }}>{s.sintoma}</p>
                  <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray }}>{s.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height:100 }}/>
      </div>
    </div>
  );
}

// ─── AGENDAR CITA ─────────────────────────────────────────────────────────────
function AgendarCita({ perfil }) {
  const [paso, setPaso] = useState(0); // 0=info, 1=formulario, 2=pago, 3=confirmado
  const [form, setForm] = useState({ motivo:"", fecha:"", hora:"", metodoPago:"" });

  const horas = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

  function campo(k, v) { setForm(p => ({...p, [k]: v})); }

  const WHATSAPP = "+58 XXX XXX XXXX"; // reemplazar con número real
  const WHATSAPP_LINK = `https://wa.me/58XXXXXXXXXX?text=Hola%20Dra.%20Radhika%20Lakshmi%2C%20quiero%20confirmar%20mi%20cita%20para%20el%20${encodeURIComponent(form.fecha)}%20a%20las%20${encodeURIComponent(form.hora)}`;

  return (
    <div style={{ fontFamily:F.family }}>
      <style>{FONT_LINK}</style>
      <div style={{ background:`linear-gradient(145deg, ${T.bgSubtle} 0%, #ECFDF5 100%)`, padding:"56px 20px 24px", borderRadius:"0 0 32px 32px", marginBottom:18 }}>
        <p style={{ ...F.label, fontFamily:F.family, color:T.gold, marginBottom:6 }}>Consulta médica virtual</p>
        <h1 style={{ ...F.h1, fontFamily:F.family, color:T.textHd, margin:"0 0 4px" }}>Agendar cita</h1>
        <p style={{ ...F.body, fontFamily:F.family, color:T.textBody }}>Con la Dra. Radhika Lakshmi Lakshmi · Medicina Interna</p>
      </div>

      <div style={{ padding:"0 16px" }}>

        {/* PASO 0 — Info del servicio */}
        {paso === 0 && (
          <>
            {/* Doctora card */}
            <div style={{ ...S.card, border:`2px solid ${T.primaryLt}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:20, background:`linear-gradient(135deg, ${T.primary}, ${T.primaryDk})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>👩‍⚕️</div>
                <div>
                  <p style={{ ...F.h2, fontFamily:F.family, color:T.textHd, margin:"0 0 2px" }}>Dra. Radhika Lakshmi</p>
                  <p style={{ ...F.sm, fontFamily:F.family, color:T.primary, fontWeight:600 }}>Medicina Interna</p>
                  <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray }}>Médico registrada · Venezuela</p>
                </div>
              </div>
              {[
                "Consulta por videollamada o WhatsApp",
                "Evaluación clínica completa",
                "Diagnóstico y plan de tratamiento",
                "Prescripción médica digital",
                "Revisión de resultados de laboratorio",
                "Sin salir de tu casa",
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:i<5?`1px solid ${T.primaryLt}`:"none" }}>
                  <span style={{ color:T.primary, fontSize:14, fontWeight:700 }}>✓</span>
                  <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:0, fontSize:13 }}>{item}</p>
                </div>
              ))}
            </div>

            {/* Precio */}
            <div style={{ ...S.card, background:T.goldLt, border:`1px solid ${T.gold}33` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ ...F.label, fontFamily:F.family, color:T.gold, marginBottom:4 }}>Precio de la consulta</p>
                  <p style={{ ...F.h1, fontFamily:F.family, color:T.textHd, margin:0 }}>$25</p>
                  <p style={{ ...F.sm, fontFamily:F.family, color:T.textBody }}>Pago previo · PayPal o Pago Móvil</p>
                </div>
                <div style={{ fontSize:40 }}>💳</div>
              </div>
            </div>

            {/* Cómo funciona */}
            <div style={S.card}>
              <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:14 }}>¿Cómo funciona?</p>
              {[
                { n:"1", txt:"Completa el formulario con tu motivo de consulta y horario preferido" },
                { n:"2", txt:"Realiza el pago de $25 por PayPal o Pago Móvil" },
                { n:"3", txt:"Envía el comprobante de pago por WhatsApp" },
                { n:"4", txt:"La Dra. Radhika Lakshmi confirma tu cita y te contacta a la hora acordada" },
                { n:"5", txt:"Recibe tu consulta, diagnóstico y prescripción desde casa" },
              ].map((p,i) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<4?`1px solid ${T.primaryLt}`:"none", alignItems:"flex-start" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg, ${T.primary}, ${T.primaryDk})`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12, fontWeight:800, flexShrink:0, fontFamily:F.family }}>{p.n}</div>
                  <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:0, fontSize:13, paddingTop:4 }}>{p.txt}</p>
                </div>
              ))}
            </div>

            <button style={S.btnPrimary} onClick={() => setPaso(1)}>Agendar mi consulta →</button>
          </>
        )}

        {/* PASO 1 — Formulario */}
        {paso === 1 && (
          <div style={S.card}>
            <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:6 }}>Paso 1 de 3</p>
            <h2 style={{ ...F.h2, fontFamily:F.family, color:T.textHd, margin:"0 0 20px" }}>Tu solicitud de cita</h2>

            <div style={{ marginBottom:16 }}>
              <label style={{ ...F.label, fontFamily:F.family, color:T.textGray, display:"block", marginBottom:6 }}>Motivo de consulta</label>
              <textarea style={{...S.input,height:80,resize:"none"}} placeholder="Describe brevemente por qué quieres consultar…" value={form.motivo} onChange={e=>campo("motivo",e.target.value)}/>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ ...F.label, fontFamily:F.family, color:T.textGray, display:"block", marginBottom:6 }}>Fecha preferida</label>
              <input style={S.input} type="date" value={form.fecha} onChange={e=>campo("fecha",e.target.value)}
                min={new Date().toISOString().split("T")[0]}/>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ ...F.label, fontFamily:F.family, color:T.textGray, display:"block", marginBottom:6 }}>Horario preferido</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {horas.map(h => (
                  <button key={h} onClick={() => campo("hora",h)} style={{ ...S.btnSecondary(form.hora===h), borderRadius:10 }}>{h}</button>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setPaso(0)} style={{ ...S.btnSecondary(false), padding:"14px 20px", borderRadius:14 }}>← Atrás</button>
              <button style={{ ...S.btnPrimary, flex:1 }} onClick={() => setPaso(2)}>Continuar al pago →</button>
            </div>
          </div>
        )}

        {/* PASO 2 — Pago */}
        {paso === 2 && (
          <>
            <div style={S.card}>
              <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:6 }}>Paso 2 de 3</p>
              <h2 style={{ ...F.h2, fontFamily:F.family, color:T.textHd, margin:"0 0 6px" }}>Realiza tu pago</h2>
              <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:"0 0 20px" }}>Elige tu método de pago preferido:</p>

              {/* PayPal */}
              <div style={{ background:T.bgMuted, borderRadius:16, padding:16, marginBottom:12, border:`1.5px solid ${T.primaryLt}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:24 }}>💳</span>
                  <p style={{ ...F.h3, fontFamily:F.family, color:T.textHd, margin:0 }}>PayPal</p>
                </div>
                <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:"0 0 4px" }}>Envía <strong>$25 USD</strong> a:</p>
                <div style={{ background:T.white, borderRadius:10, padding:"10px 14px", border:`1px solid ${T.primaryLt}` }}>
                  <p style={{ ...F.h3, fontFamily:F.family, color:T.primary, margin:0, fontSize:14 }}>pagos@velavenezuela.com</p>
                </div>
                <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray, marginTop:6 }}>Selecciona "Pago a familiar o amigo" para evitar comisiones</p>
              </div>

              {/* Pago Móvil */}
              <div style={{ background:T.bgMuted, borderRadius:16, padding:16, marginBottom:20, border:`1.5px solid ${T.primaryLt}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:24 }}>📱</span>
                  <p style={{ ...F.h3, fontFamily:F.family, color:T.textHd, margin:0 }}>Pago Móvil</p>
                </div>
                {[
                  { label:"Banco", valor:"XXX (completar)" },
                  { label:"Cédula", valor:"V-XXXXXXXX (completar)" },
                  { label:"Teléfono", valor:"+58 XXX XXX XXXX (completar)" },
                  { label:"Monto", valor:"Equivalente a $25 USD" },
                  { label:"Concepto", valor:"Consulta médica Vela" },
                ].map(f => (
                  <div key={f.label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${T.primaryLt}` }}>
                    <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray, margin:0 }}>{f.label}</p>
                    <p style={{ ...F.sm, fontFamily:F.family, color:T.textHd, fontWeight:600, margin:0 }}>{f.valor}</p>
                  </div>
                ))}
              </div>

              <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, marginBottom:16, lineHeight:1.6 }}>
                📸 Una vez realizado el pago, envía el <strong>comprobante por WhatsApp</strong> al número de la Dra. Radhika Lakshmi Lakshmi para confirmar tu cita.
              </p>

              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                <button style={{ ...S.btnPrimary, background:`linear-gradient(135deg, #25D366, #128C7E)`, marginBottom:12 }}>
                  📲 Enviar comprobante por WhatsApp
                </button>
              </a>

              <button onClick={() => setPaso(3)} style={S.btnGold}>
                ✓ Ya realicé mi pago
              </button>
            </div>

            <button onClick={() => setPaso(1)} style={{ ...S.btnSecondary(false), width:"100%", padding:"14px", borderRadius:14, marginBottom:14 }}>← Atrás</button>
          </>
        )}

        {/* PASO 3 — Confirmado */}
        {paso === 3 && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ width:80, height:80, borderRadius:26, background:`linear-gradient(135deg, ${T.primary}, ${T.primaryDk})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:40 }}>✅</div>
            <h2 style={{ ...F.h2, fontFamily:F.family, color:T.textHd, marginBottom:8 }}>¡Solicitud enviada!</h2>
            <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, marginBottom:24, lineHeight:1.7 }}>
              La Dra. Radhika Lakshmi revisará tu comprobante y confirmará tu cita por WhatsApp. Recibirás confirmación en las próximas horas.
            </p>

            <div style={{ ...S.card, textAlign:"left" }}>
              <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:12 }}>Resumen de tu cita</p>
              {[
                { l:"Médico", v:"Dra. Radhika Lakshmi" },
                { l:"Especialidad", v:"Medicina Interna" },
                { l:"Fecha preferida", v:form.fecha || "Por confirmar" },
                { l:"Horario preferido", v:form.hora || "Por confirmar" },
                { l:"Monto pagado", v:"$25 USD" },
                { l:"Modalidad", v:"Videollamada / WhatsApp" },
              ].map(f => (
                <div key={f.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.primaryLt}` }}>
                  <p style={{ ...F.body, fontFamily:F.family, color:T.textGray, margin:0 }}>{f.l}</p>
                  <p style={{ ...F.body, fontFamily:F.family, color:T.textHd, fontWeight:600, margin:0 }}>{f.v}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setPaso(0)} style={{ ...S.btnPrimary, marginTop:8 }}>
              Agendar otra consulta
            </button>
          </div>
        )}

        <div style={{ height:100 }}/>
      </div>
    </div>
  );
}

// ─── PERFIL ───────────────────────────────────────────────────────────────────
function Perfil({ state, dispatch }) {
  const { perfil, consultas, sintomas } = state;
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(perfil||{});

  function guardar() {
    const u = { ...perfil, ...form };
    dispatch({ type:"SET_PERFIL", payload:u });
    lsSet("vela:perfil", u);
    setEditando(false);
  }

  function reset() {
    if (confirm("¿Seguro que quieres borrar todos tus datos?")) {
      lsClear("vela:perfil"); lsClear("vela:consultas"); lsClear("vela:sintomas");
      window.location.reload();
    }
  }

  return (
    <div style={{ fontFamily:F.family }}>
      <style>{FONT_LINK}</style>
      <div style={{ background:`linear-gradient(145deg, ${T.bgSubtle} 0%, #ECFDF5 100%)`, padding:"56px 20px 24px", borderRadius:"0 0 32px 32px", marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:64, height:64, borderRadius:22, background:`linear-gradient(135deg, ${T.primary}, ${T.primaryDk})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:T.white, fontWeight:800, fontFamily:F.family, flexShrink:0 }}>
            {perfil?.nombre?.[0]?.toUpperCase()||"🕯️"}
          </div>
          <div>
            <h1 style={{ ...F.h1, fontFamily:F.family, color:T.textHd, fontSize:22, margin:"0 0 4px" }}>{perfil?.nombre||"Mi Perfil"}</h1>
            <p style={{ ...F.body, fontFamily:F.family, color:T.textBody, margin:0 }}>{perfil?.ciudad||"Venezuela"}</p>
          </div>
        </div>
      </div>

      <div style={{ padding:"0 16px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[
            { icon:"💬", label:"Consultas", val:sintomas.length },
            { icon:"📋", label:"Citas agendadas", val:consultas.length },
            { icon:"🎂", label:"Edad", val:perfil?.edad ? `${perfil.edad} años` : "—" },
            { icon:"📍", label:"Ciudad", val:perfil?.ciudad||"—" },
          ].map(s => (
            <div key={s.label} style={{...S.card,margin:0,textAlign:"center",padding:16}}>
              <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
              <p style={{...F.h3,fontFamily:F.family,color:T.textHd,margin:"0 0 2px",fontSize:15}}>{s.val}</p>
              <p style={{...F.sm,fontFamily:F.family,color:T.textGray,margin:0}}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p style={{ ...F.label, fontFamily:F.family, color:T.primary, margin:0 }}>Mis datos</p>
            <button onClick={() => setEditando(!editando)} style={{...S.btnSecondary(editando),padding:"7px 14px"}}>{editando?"Cancelar":"Editar"}</button>
          </div>

          {editando ? (
            <>
              {[{l:"Nombre",k:"nombre",t:"text"},{l:"Edad",k:"edad",t:"number"},{l:"Ciudad",k:"ciudad",t:"text"}].map(f => (
                <div key={f.k} style={{ marginBottom:14 }}>
                  <label style={{ ...F.label, fontFamily:F.family, color:T.textGray, display:"block", marginBottom:6 }}>{f.l}</label>
                  <input style={S.input} type={f.t} value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}
              <button style={S.btnPrimary} onClick={guardar}>Guardar cambios</button>
            </>
          ) : (
            [{l:"Nombre",v:perfil?.nombre},{l:"Edad",v:perfil?.edad?`${perfil.edad} años`:"—"},{l:"Ciudad",v:perfil?.ciudad||"—"},{l:"Sexo",v:perfil?.sexo||"—"}].map(f => (
              <div key={f.l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.primaryLt}` }}>
                <p style={{ ...F.body, fontFamily:F.family, color:T.textGray, margin:0 }}>{f.l}</p>
                <p style={{ ...F.body, fontFamily:F.family, color:T.textHd, fontWeight:600, margin:0 }}>{f.v}</p>
              </div>
            ))
          )}
        </div>

        {(perfil?.condiciones || perfil?.medicamentos) && (
          <div style={S.card}>
            <p style={{ ...F.label, fontFamily:F.family, color:T.primary, marginBottom:12 }}>Historial médico</p>
            {perfil.condiciones && (
              <div style={{ marginBottom:12 }}>
                <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray, marginBottom:4 }}>Condiciones crónicas</p>
                <p style={{ ...F.body, fontFamily:F.family, color:T.textHd }}>{perfil.condiciones}</p>
              </div>
            )}
            {perfil.medicamentos && (
              <div>
                <p style={{ ...F.sm, fontFamily:F.family, color:T.textGray, marginBottom:4 }}>Medicamentos actuales</p>
                <p style={{ ...F.body, fontFamily:F.family, color:T.textHd }}>{perfil.medicamentos}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:14, padding:16, marginBottom:14 }}>
          <p style={{ ...F.sm, fontFamily:F.family, color:"#991B1B", margin:0, lineHeight:1.6 }}>
            🚨 <strong>Emergencias:</strong> Vela no atiende emergencias médicas. En caso de emergencia llama al <strong>911</strong> o acude al hospital más cercano.
          </p>
        </div>

        <div style={{ background:T.bgMuted, borderRadius:16, padding:16, marginBottom:14, border:`1px solid ${T.primaryLt}` }}>
          <p style={{ ...F.sm, fontFamily:F.family, color:T.textBody, margin:0, lineHeight:1.7 }}>
            🛡️ <strong>Aviso legal:</strong> Vela es una plataforma de orientación médica e información en salud. Las consultas con la Dra. Radhika Lakshmi Lakshmi son servicios médicos profesionales. Vela no se hace responsable de decisiones médicas tomadas sin consultar a un profesional.
          </p>
        </div>

        <button onClick={reset} style={{...S.btnPrimary,background:"#FEF2F2",color:"#EF4444",boxShadow:"none",border:"1px solid #FECACA",marginBottom:8}}>
          Eliminar mis datos
        </button>

        <div style={{ height:100 }}/>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function VelaVenezuela() {
  const [state, dispatch] = useReducer(reducer, init);
  const [tab, setTab] = useState("inicio");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const perfil   = lsGet("vela:perfil");
    const sintomas = lsGet("vela:sintomas") || [];
    const consultas = lsGet("vela:consultas") || [];
    dispatch({ type:"LOAD", payload:{ perfil, sintomas, consultas } });
    setListo(true);
  }, []);

  if (!listo) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bgBase, fontFamily:F.family }}>
      <style>{FONT_LINK}</style>
      <Cargando texto="Cargando Vela…"/>
    </div>
  );

  if (!state.perfil) return (
    <div style={{ maxWidth:480, margin:"0 auto" }}>
      <Onboarding onComplete={p => {
        dispatch({ type:"SET_PERFIL", payload:p });
        lsSet("vela:perfil", p);
      }}/>
    </div>
  );

  const tabs = {
    inicio:    <Inicio perfil={state.perfil} onNavegar={setTab}/>,
    consultar: <Consultar perfil={state.perfil} state={state} dispatch={dispatch} onNavegar={setTab}/>,
    cita:      <AgendarCita perfil={state.perfil}/>,
    perfil:    <Perfil state={state} dispatch={dispatch}/>,
  };

  return (
    <div style={{ maxWidth:480, margin:"0 auto", background:T.bgBase, minHeight:"100vh", fontFamily:F.family }}>
      <style>{FONT_LINK + `*{box-sizing:border-box}`}</style>
      <div style={{ paddingBottom:80 }}>{tabs[tab]}</div>
      <TabBar activa={tab} onChange={setTab}/>
    </div>
  );
}
