import React, { useEffect, useMemo, useRef, useState } from "react";

export default function InvitacionMiaFernanda() {
  // =========================
  // EDITABLE DATA
  // =========================
  const DATA = useMemo(
    () => ({
      festejada: "Mia Fernanda",
      edad: "8 Años",
      fecha: "12 de marzo 2026",
      hora: "10:00 a.m.",
      lugar: "📍 (Lugar por confirmar)", // <-- aquí pegas después
      mapsUrl: "", // opcional: "https://maps.google.com/?q=..."
      whatsappPhone: "52XXXXXXXXXX", // <-- cambia a tu número con código país, sin +, sin espacios
      whatsappMsg:
        "¡Hola! Confirmo asistencia a la fiesta de Mia Fernanda el 12 de marzo 2026 a las 10:00 a.m.",
      dressCode: "Colores invernales: azul, blanco o plata (opcional).",
    }),
    []
  );

  // =========================
  // VIDEO SETTINGS
  // =========================
  const VIDEO_SRC = "/intro.mp4"; // coloca el video aquí (public/intro.mp4)
  const [phase, setPhase] = useState("video"); // "video" | "invite"
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);

  // Si el autoplay falla (iOS / restricciones), mostramos botón "Toca para reproducir"
  const [needsUserPlay, setNeedsUserPlay] = useState(false);

  // Caption overlay (aparece 1s después de iniciar reproducción)
  const [showVideoCaption, setShowVideoCaption] = useState(false);

  useEffect(() => {
    if (phase !== "video") return;

    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        await v.play();
        setNeedsUserPlay(false);

        // Mostrar caption 1s después de comenzar
        setShowVideoCaption(false);
        window.setTimeout(() => setShowVideoCaption(true), 1000);
      } catch (e) {
        setNeedsUserPlay(true);
      }
    };

    tryPlay();
  }, [phase]);

  const whatsappLink = useMemo(() => {
    const text = encodeURIComponent(DATA.whatsappMsg);
    return `https://wa.me/${DATA.whatsappPhone}?text=${text}`;
  }, [DATA.whatsappMsg, DATA.whatsappPhone]);

  const goInvite = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setShowVideoCaption(false);

    // 1) Fade-out del overlay
    setTimeout(() => {
      setPhase("invite");

      // 2) Fade-in de la invitación
      requestAnimationFrame(() => setInviteVisible(true));

      // reset
      setTimeout(() => setIsTransitioning(false), 500);
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-950 via-sky-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute top-40 left-8 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute top-72 right-6 h-64 w-64 rounded-full bg-indigo-300/10 blur-3xl" />
      </div>

      {/* Snow layer */}
      <SnowLayer />

      {/* =========================
          PHASE 1: VIDEO OVERLAY
         ========================= */}
      {phase === "video" && (
        <div
          className={[
            "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-opacity duration-500",
            isTransitioning ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >

          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70 shadow-2xl">
            {/* Frost border shimmer */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/15" />
            <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-70 [mask-image:radial-gradient(180px_180px_at_50%_0%,black,transparent)]">
              <div className="h-full w-full animate-shimmer bg-gradient-to-r from-white/0 via-white/15 to-white/0" />
            </div>

            <div className="p-4">
              {/* Botón "Saltar" flotante, discreto */}
              <button
                onClick={goInvite}
                className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/90 backdrop-blur hover:bg-black/40 active:scale-[0.99]"
              >
                Saltar
              </button>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <div className="relative w-full aspect-[9/16]">
                  <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    className="absolute inset-0 h-full w-full object-cover"
                    playsInline
                    muted
                    autoPlay
                    controls={false}
                    onEnded={goInvite}
                    onError={() => setVideoError(true)}
                  />

                  {/* Caption overlay (mágico) */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div
                      className={[
                        "relative mx-auto w-fit max-w-[92%] overflow-hidden rounded-2xl border border-white/15 bg-black/45 px-5 py-3 text-center text-3xl sm:text-4xl font-extrabold leading-tight text-white backdrop-blur",
                        "transition-all duration-700 ease-out",
                        showVideoCaption ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                      ].join(" ")}
                    >
                      <span className="relative z-10">
                        ¡Estás invitado a una aventura congelada!
                      </span>
                      <span className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(220px_60px_at_50%_0%,black,transparent)]">
                        <span className="block h-full w-full animate-shimmer bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Solo mostramos UI cuando hay error o cuando se requiere tap para reproducir */}
              {videoError ? (
                <div className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
                  No se pudo cargar el video. Revisa la ruta{" "}
                  <span className="font-mono">{VIDEO_SRC}</span>.
                  <div className="mt-2">
                    <button
                      onClick={goInvite}
                      className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
                    >
                      Ver invitación
                    </button>
                  </div>
                </div>
              ) : needsUserPlay ? (
                <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur">
                  <button
                    onClick={async () => {
                      try {
                        await videoRef.current?.play();
                        setNeedsUserPlay(false);

                        setShowVideoCaption(false);
                        window.setTimeout(() => setShowVideoCaption(true), 1000);
                      } catch {
                        setNeedsUserPlay(true);
                      }
                    }}
                    className="w-full rounded-xl bg-cyan-400/20 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400/25 active:scale-[0.99]"
                  >
                    Toca para reproducir
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          PHASE 2/3: INVITATION MOBILE
         ========================= */}
      <main
        className={[
          "relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-8 transition-all duration-700",
          phase === "invite" && inviteVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Top badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-300/80" />
          Invitación • Fantasía Invernal
        </div>

        {/* Card */}
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
          {/* Frost frame */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/15" />
          <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-70 [mask-image:radial-gradient(220px_220px_at_50%_0%,black,transparent)]">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-white/0 via-white/15 to-white/0" />
          </div>

          {/* Aurora header */}
          <div className="relative p-6">
            <AuroraHeader />

            <div className="relative mt-4 text-center">
              <p className="text-sm tracking-wide text-white/80">
                Te invitamos a celebrar
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                {DATA.festejada}
              </h1>
              <p className="mt-2 text-white/80">
                cumple{" "}
                <span className="font-semibold text-white">{DATA.edad}</span>
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-white/15" />
              <SnowflakeIcon className="h-5 w-5 text-white/70" />
              <div className="h-px w-16 bg-white/15" />
            </div>

            {/* Details */}
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <InfoRow label="📅 Fecha" value={DATA.fecha} />
              <InfoRow label="⏰ Hora" value={DATA.hora} />
              <InfoRow label="📍 Lugar" value={DATA.lugar} />
            </div>

            {/* Optional sections */}
            <div className="mt-4 grid gap-3">
              {DATA.dressCode?.trim() ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-white/80">
                    Dress code
                  </p>
                  <p className="mt-1 text-sm text-white/85">{DATA.dressCode}</p>
                </div>
              ) : null}

              {DATA.mapsUrl?.trim() ? (
                <a
                  href={DATA.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85 hover:bg-white/10"
                >
                  🗺️ Abrir ubicación en Maps
                </a>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  🗺️ Ubicación: pendiente (la agregas cuando me la pases)
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-2xl bg-cyan-400/20 px-5 py-4 text-center text-sm font-semibold text-white hover:bg-cyan-400/25 active:scale-[0.99]"
              >
                Confirmar asistencia por WhatsApp
              </a>
              <p className="mt-2 text-center text-xs text-white/60">
                (Se abrirá WhatsApp con un mensaje prellenado)
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/80">
                ¡Será un día mágico entre nieve y luces!
              </p>
              <p className="mt-1 text-xs text-white/55">
                Invitación con estética original (fantasía invernal).
              </p>
            </div>
          </div>
        </section>

        {/* Bottom spacing for mobile */}
        <div className="h-10" />
      </main>

      {/* Keyframes (solo en este componente) */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        .animate-shimmer {
          animation: shimmer 2.8s ease-in-out infinite;
        }

        @keyframes snow {
          0% { transform: translateY(-10%); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

/* =========================
   UI Subcomponents
   ========================= */

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm text-white/70">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function AuroraHeader() {
  return (
    <div className="relative mx-auto h-28 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
      <div className="absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_40%,rgba(34,211,238,0.22),transparent_60%),radial-gradient(80%_50%_at_25%_60%,rgba(129,140,248,0.18),transparent_65%),radial-gradient(80%_50%_at_75%_65%,rgba(16,185,129,0.12),transparent_70%)]" />
      <div className="absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <div className="h-full w-full animate-shimmer bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
      </div>

      {/* Simple geometric ice castle */}
      <svg
        viewBox="0 0 360 120"
        className="absolute bottom-0 left-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M40 110 L70 70 L90 90 L120 50 L150 75 L180 35 L210 78 L240 45 L270 88 L300 65 L330 110 Z"
          fill="rgba(255,255,255,0.08)"
        />
        <path
          d="M60 110 L85 85 L105 110 Z"
          fill="rgba(255,255,255,0.12)"
        />
        <path
          d="M155 110 L180 60 L205 110 Z"
          fill="rgba(255,255,255,0.12)"
        />
        <path
          d="M255 110 L280 80 L305 110 Z"
          fill="rgba(255,255,255,0.12)"
        />
      </svg>

      {/* Stars */}
      <div className="absolute inset-0">
        <div className="absolute left-6 top-4 h-1 w-1 rounded-full bg-white/60" />
        <div className="absolute left-20 top-8 h-1 w-1 rounded-full bg-white/50" />
        <div className="absolute right-10 top-6 h-1 w-1 rounded-full bg-white/60" />
        <div className="absolute right-24 top-10 h-1 w-1 rounded-full bg-white/40" />
      </div>
    </div>
  );
}

function SnowflakeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2v20M4 6l16 12M20 6L4 18M7 3l2 3M15 3l-2 3M7 21l2-3M15 21l-2-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================
   Snow animation (pure CSS)
   ========================= */

function SnowLayer() {
  // 18 flakes, deterministic layout
  const flakes = Array.from({ length: 18 }).map((_, i) => {
    const left = (i * 100) / 18; // %
    const size = 6 + (i % 6) * 2; // px
    const duration = 8 + (i % 7); // s
    const delay = -(i % 9); // start mid-animation
    const opacity = 0.25 + (i % 5) * 0.12;
    return { left, size, duration, delay, opacity, i };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.i}
          className="absolute -top-10 rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            filter: "blur(0.2px)",
            animation: `snow ${f.duration}s linear infinite`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
