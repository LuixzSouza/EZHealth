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
                <div className="flex flex-col items-center justify-center gap-10 bg-orange/80 border border-orange rounded-3xl h-[580px] overflow-hidden relative mt-11">

                    {/* Se não estiver tocando, mostra o botão */}
                    {!isPlaying && (
                        <div className="bg-videoMockup bg-contain bg-center bg-no-repeat w-full h-full flex items-center justify-center " >
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="relative group z-20 w-32 h-32 flex items-center justify-center border-4 border-black/50 rounded-full bg-black/20 hover:bg-opacity-40 transition hover:scale-105 hover:border-black"
                            >
                                <Image
                                    className="opacity-80 group-hover:opacity-100"
                                    src="/icons/play-black.svg"
                                    alt="Play"
                                    width={55}
                                    height={65}
                                />
                                <ToolAssistentText>
                                    Iniciar Vídeo 
                                </ToolAssistentText>
                            </button>
                        </div>
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
