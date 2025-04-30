'use client';

import { useState } from "react";
import Image from "next/image";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";

export function VideoSection() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="py-14">
            <ContainerGrid>
                <HeadingOrange text="Vídeo utilizando o software" />
                <div className="flex flex-col items-center justify-center gap-10 bg-orange rounded-3xl h-[580px] overflow-hidden relative mt-11">

                    {/* Se não estiver tocando, mostra o botão */}
                    {!isPlaying && (
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="z-20 w-32 h-32 flex items-center justify-center border-4 border-white rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition"
                        >
                            <Image
                                className="invert"
                                src="/icons/play-black.svg"
                                alt="Play"
                                width={55}
                                height={65}
                            />
                        </button>
                    )}

                    {/* Se estiver tocando, mostra o vídeo */}
                    {isPlaying && (
                        <video
                        className="w-full h-full object-contain rounded-3xl"
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                        controls
                        autoPlay
                        onEnded={() => setIsPlaying(false)}
                        />
                    )}
                </div>
            </ContainerGrid>
        </section>
    );
}
