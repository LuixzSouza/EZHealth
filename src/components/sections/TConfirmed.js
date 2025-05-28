import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";

export function TConfirmed() {
  return (
    <section className="h-screen flex items-center justify-center bg-white px-4">
      <ContainerGrid className="w-full max-w-lg bg-orange/10 shadow-xl rounded-3xl p-10 flex flex-col items-center gap-6 text-center">

        <HeadingOrange text="ATENDIMENTO CONFIRMADO" />
        <ParagraphBlue>Seu atendimento foi registrado com sucesso!</ParagraphBlue>

        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-orange text-lg font-semibold">Senha:</p>
            <p className="text-2xl text-blue-900 font-bold">A123</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-orange text-lg font-semibold">Sala:</p>
            <p className="text-2xl text-blue-900 font-bold">03</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-orange text-lg font-semibold">Médico:</p>
            <p className="text-2xl text-blue-900 font-bold">Dr. João Silva</p>
          </div>
        </div>

      </ContainerGrid>
    </section>
  );
}
