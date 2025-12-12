import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center">
        <div className="mb-8">
          <Image
            src="/logo/cofe.png"
            alt="JDR Logo"
            width={128}
            height={128}
            className="mx-auto"
            style={{ imageRendering: 'pixelated' }}
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          JDR Tools
        </h1>
        <p className="text-xl text-white/80 drop-shadow">
          Outils pour Jeux de Rôle
        </p>
      </div>
    </div>
  );
}
