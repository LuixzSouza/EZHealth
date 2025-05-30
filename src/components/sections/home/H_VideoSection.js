'use client';

import { useState } from "react";
import Image from "next/image";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { ToolAssistentText } from "@/components/utils/ToolAssistentText";
import { Heading } from "@/components/typography/Heading";

export function H_VideoSection() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="dark:bg-themeDark py-14">
            <ContainerGrid>
                <Heading colorClass='dark:text-orangeDark text-orange' text='Vídeo utilizando o software'/>
                <div className="flex flex-col items-center justify-center gap-10 bg-orange rounded-3xl h-[580px] overflow-hidden relative mt-11">

                    {/* Se não estiver tocando, mostra o botão */}
                    {!isPlaying && (
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="relative group z-20 w-32 h-32 flex items-center justify-center border-4 border-white rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition"
                        >
                            <Image
                                className="invert"
                                src="/icons/play-black.svg"
                                alt="Play"
                                width={55}
                                height={65}
                            />
                            <ToolAssistentText>
                                Iniciar Vídeo 
                            </ToolAssistentText>
                        </button>
                    )}

                    {/* Se estiver tocando, mostra o vídeo */}
                    {isPlaying && (
                        <video
                        className="w-full h-full object-contain rounded-3xl"
                        src="/video/EZHealh_Video.mp4"
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
