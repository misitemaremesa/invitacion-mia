import React, { useEffect, useMemo, useRef, useState } from "react";

export default function InvitacionMiaFernanda() {
  // =========================
  // EDITABLE DATA
  // =========================
  const DATA = useMemo(
    () => ({
      festejada: "Mía Fernanda",
      edad: "8 Años",
      fecha: "12 de marzo 2026",
      hora: "10:00 a.m.",
      lugar: "Colegio Jaques Roussea",
    }),
    []
  );

  const calendarLink = useMemo(() => {
    const title = encodeURIComponent("Cumpleaños #8 de Mía Fernanda");
    const details = encodeURIComponent(
      "Acompáñanos a celebrar el cumpleaños de Mía Fernanda con una aventura invernal llena de magia."
    );
    const location = encodeURIComponent(DATA.lugar);

    // Hora local de México (CDMX): UTC-6 para marzo 2026
    const start = "20260312T160000Z";
    const end = "20260312T190000Z";

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  }, [DATA.lugar]);

  // =========================
  // VIDEO + AUDIO SETTINGS
  // =========================
  const VIDEO_SRC = "/intro.mp4"; // public/intro.mp4
  const AUDIO_SRC = "/tema.mp3"; // public/tema.mp3 (sin audio en el video)

  const [phase, setPhase] = useState("video"); // "video" | "invite"
  const [videoError, setVideoError] = useState(false);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);

  // caption overlay (aparece 1s después de iniciar reproducción)
  const [showVideoCaption, setShowVideoCaption] = useState(false);

  // transiciones suaves
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const captionTimeoutRef = useRef(null);


  const clearCaptionTimer = () => {
    if (captionTimeoutRef.current) {
      window.clearTimeout(captionTimeoutRef.current);
      captionTimeoutRef.current = null;
    }
  };

  const scheduleCaption = () => {
    clearCaptionTimer();
    setShowVideoCaption(false);
    captionTimeoutRef.current = window.setTimeout(() => {
      setShowVideoCaption(true);
    }, 1000);
  };

  const startAudio = async () => {
    const a = audioRef.current;
    if (!a || isMuted) return;

    // no reiniciar si ya está sonando
    if (!a.paused) return;

    try {
      a.volume = 0.7; // ajusta a gusto
      await a.play();
    } catch {
      // Autoplay puede ser bloqueado (normal en móviles). Se intentará de nuevo con interacción.
    }
  };

  const goInvite = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    clearCaptionTimer();
    setShowVideoCaption(false);

    // Fade-out overlay primero, luego mostramos invitación con fade-in
    window.setTimeout(() => {
      setPhase("invite");
      requestAnimationFrame(() => setInviteVisible(true));
      window.setTimeout(() => setIsTransitioning(false), 500);
    }, 450);
  };

  // Intentar autoplay del video (y audio) cuando estamos en fase video
  useEffect(() => {
    if (phase !== "video") return;

    setInviteVisible(false);
    setVideoError(false);
    setNeedsUserPlay(false);

    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        await v.play();
        setNeedsUserPlay(false);

        // Arrancar audio si se puede (si el navegador lo permite)
        await startAudio();

        // Caption 1s después
        scheduleCaption();
      } catch {
        setNeedsUserPlay(true);
      }
    };

    tryPlay();

    return () => {
      clearCaptionTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.muted = isMuted;

    if (!isMuted && a.paused) {
      a.volume = 0.7;
      a.play().catch(() => {
        // Puede requerir interacción del usuario en algunos navegadores.
      });
    }
  }, [isMuted]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-950 via-sky-900 to-slate-950 text-white overflow-hidden">
      {/* Audio global: continúa después del video */}
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" muted={isMuted} />

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
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70 shadow-2xl">
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

                  {/* Caption overlay (mágico + grande) */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div
                      className={[
                        "relative mx-auto w-fit max-w-[92%] overflow-hidden rounded-2xl border border-white/15 bg-black/45 px-5 py-3 text-center text-3xl sm:text-4xl font-extrabold leading-tight text-white backdrop-blur",
                        "transition-all duration-700 ease-out",
                        showVideoCaption
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3",
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

                        // intentar arrancar audio con interacción
                        await startAudio();

                        // caption 1s después
                        scheduleCaption();
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
          phase === "invite" && inviteVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Texto arriba de la imagen */}
        <p className="mt-4 text-center text-sm tracking-wide text-white/80">
          Una mañana mágica para celebrar a
        </p>

        {/* Card */}
        <section className="relative mt-4 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
          {/* Frost frame */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/15" />
          <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-70 [mask-image:radial-gradient(220px_220px_at_50%_0%,black,transparent)]">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-white/0 via-white/15 to-white/0" />
          </div>

          <div className="relative p-6">
            {/* Header con imagen + nombre/edad dentro del cuadro */}
            <AuroraHeader />

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
            {/* CTA */}
            <div className="mt-6">
              <a
                href={calendarLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center text-sm font-semibold text-white hover:bg-white/15 active:scale-[0.99]"
              >
                Agregar al calendario 📅
              </a>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/80">
                ¡Mía Fernanda está emocionada por celebrar contigo!
              </p>
              <p className="mt-1 text-xs text-white/55">
                Habrá sonrisas, juegos y mucha fantasía invernal.
              </p>
            </div>
          </div>
        </section>

        <div className="h-10" />
      </main>

      <button
        onClick={() => setIsMuted((prev) => !prev)}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-white/20 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur hover:bg-slate-800/80 active:scale-[0.98]"
        aria-label={isMuted ? "Activar música" : "Silenciar música"}
      >
        {isMuted ? "🔇 Música" : "🔊 Música"}
      </button>


      {/* Keyframes (solo en este componente) */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        .animate-shimmer {
          animation: shimmer 2.8s ease-in-out infinite;
        }


        @keyframes stickerPopIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.9); }
          70% { opacity: 1; transform: translateY(0) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .sticker-pop-in {
          animation: stickerPopIn 800ms ease-out both;
        }
        .sticker-pop-in-delay {
          animation: stickerPopIn 950ms ease-out 180ms both;
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
    <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
      <div className="relative h-[34rem] sm:h-[38rem] overflow-hidden">
        <img
          src="/fond_01_complet.jpg"
          alt="Marco de Frozen"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />

        {/* Overlay suave para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/25" />

        {/* Stickers posicionados dentro del pizarrón */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2">
            <img
              src="/mia_01.png"
              alt="Mía Fernanda"
              className="sticker-pop-in w-[72%] min-w-[260px] max-w-[360px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.55)]"
              loading="eager"
            />
          </div>

          <div className="absolute left-1/2 top-[67%] -translate-x-1/2 -translate-y-1/2">
            <img
              src="/cumple_01.png"
              alt="Cumple 8 años"
              className="sticker-pop-in-delay w-[78%] min-w-[280px] max-w-[390px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.55)]"
              loading="eager"
            />
          </div>
        </div>
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
