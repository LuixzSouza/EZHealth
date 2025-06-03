// src/app/termos-de-uso/page.js ou src/pages/termos-de-uso.js
'use client'; // Necessário para componentes no lado do cliente

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header'; // Verifique o caminho correto
import { Heading } from '@/components/typography/Heading'; // Verifique o caminho correto
import { ParagraphBlue } from '@/components/theme/ParagraphBlue'; // Verifique o caminho correto

export default function TermosDeUsoPage() {
  useEffect(() => {
    document.title = "Termos de Uso - EZHealth";
  }, []);

  return (
    <>
      <Header /> {/* Inclui o cabeçalho do seu site */}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 mt-8 mb-12">
        <article className="bg-white dark:bg-themeDark p-6 sm:p-8 rounded-lg shadow-lg">
          <Heading
            as="h1"
            text="Termos de Uso"
            colorClass="text-DarkBlue dark:text-orangeDark"
            className="mb-6 text-3xl sm:text-4xl text-center"
          />
          <ParagraphBlue className="text-sm sm:text-base text-center mb-8">
            Última atualização: 3 de junho de 2025
          </ParagraphBlue>

          <section className="mb-8">
            <Heading
              as="h2"
              text="1. Aceitação dos Termos"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              Ao criar uma conta, acessar ou utilizar qualquer parte dos Serviços da EZHealth, você declara que leu, compreendeu e concorda em cumprir estes Termos, bem como a nossa <a href="/politica-de-privacidade" className="text-blue-600 hover:underline dark:text-blue-400">Política de Privacidade</a>. Estes Termos constituem um contrato legal vinculante entre você e a EZHealth.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="2. Uso dos Serviços"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Elegibilidade:</span> Nossos Serviços são destinados a usuários maiores de 18 anos ou, no caso de menores, que estejam sob a supervisão e com o consentimento expresso de seus pais ou responsáveis legais.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Finalidade:</span> Os Serviços da EZHealth são fornecidos para auxiliar na triagem e no gerenciamento de informações de saúde e atendimento. Eles <strong className="text-red-500">não substituem</strong> o aconselhamento, diagnóstico ou tratamento médico profissional. Em caso de emergência médica, procure atendimento imediato.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Sua Conta:</span> Você é responsável por manter a confidencialidade das suas credenciais de login e por todas as atividades que ocorrem em sua conta. Notifique a EZHealth imediatamente sobre qualquer uso não autorizado da sua conta.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Conduta do Usuário:</span> Você concorda em usar os Serviços de forma responsável, legal e de acordo com estes Termos. É proibido: violar leis, enviar conteúdo ilegal, tentar acesso não autorizado, interferir nos Serviços, usar para fins comerciais sem autorização.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="3. Conteúdo do Usuário"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              Ao enviar, postar ou exibir qualquer conteúdo (como informações pessoais, dados de saúde) através dos Serviços, você concede à EZHealth uma licença mundial, não exclusiva, livre de royalties, sublicenciável e transferível para usar, reproduzir, distribuir, preparar trabalhos derivados e exibir tal conteúdo apenas para a finalidade de fornecer e melhorar os Serviços. Você declara e garante que possui todos os direitos necessários para conceder essa licença.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="4. Propriedade Intelectual"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              Todo o conteúdo e materiais disponíveis nos Serviços, incluindo, mas não se limitando a textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais, compilações de dados e software, são propriedade da EZHealth ou de seus licenciadores e são protegidos por leis de direitos autorais, marcas registradas e outras leis de propriedade intelectual. Estes Termos não concedem a você nenhum direito sobre a propriedade intelectual da EZHealth.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="5. Isenção de Garantias e Limitação de Responsabilidade"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Sem Garantias Médicas:</span> A EZHealth fornece uma plataforma de gerenciamento de informações e triagem. As informações e os serviços não constituem e não devem ser interpretados como aconselhamento médico, diagnóstico ou tratamento. A responsabilidade final pela tomada de decisões clínicas é sempre do profissional de saúde devidamente habilitado.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Disponibilidade:</span> A EZHealth se esforça para manter os Serviços disponíveis e operacionais, mas não garante que estarão sempre acessíveis, ininterruptos, seguros ou livres de erros.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Limitação de Responsabilidade:</span> Na extensão máxima permitida pela lei aplicável, a EZHealth não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou exemplares (incluindo, sem limitação, danos por perda de lucros, dados ou outras perdas intangíveis) resultantes do uso ou da incapacidade de usar os Serviços.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="6. Links para Terceiros"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              Os Serviços podem conter links para sites ou recursos de terceiros. A EZHealth não endossa e não é responsável pelo conteúdo, produtos ou serviços desses sites ou recursos. Você reconhece e concorda que a EZHealth não será responsável por quaisquer danos ou perdas causados pelo uso de tais links.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="7. Rescisão"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              A EZHealth pode suspender ou rescindir seu acesso aos Serviços, com ou sem aviso prévio, por qualquer motivo, incluindo, mas não se limitando a, violação destes Termos. Após a rescisão, seu direito de usar os Serviços cessará imediatamente.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="8. Alterações nos Termos"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              A EZHealth se reserva o direito de modificar estes Termos a qualquer momento. Notificaremos você sobre alterações significativas através da publicação dos Termos revisados em nosso site ou por meio de outros canais de comunicação. Seu uso continuado dos Serviços após a publicação de quaisquer alterações constitui sua aceitação dos Termos revisados.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="9. Disposições Gerais"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Lei Aplicável e Foro:</span> Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Qualquer disputa será submetida aos tribunais da comarca da sede da EZHealth.</li>
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Integralidade:</span> Estes Termos, juntamente com a <a href="/politica-de-privacidade" className="text-blue-600 hover:underline dark:text-blue-400">Política de Privacidade</a>, constituem o acordo integral entre você e a EZHealth.</li>
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Renúncia:</span> A falha da EZHealth em exercer qualquer direito não constitui renúncia.</li>
            </ul>
          </section>

          <section>
            <Heading
              as="h2"
              text="10. Contato"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              Se você tiver dúvidas sobre estes Termos de Uso, por favor, entre em contato conosco:
            </ParagraphBlue>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300 mt-2">
              <li><span className="font-semibold text-DarkBlue dark:text-white">E-mail:</span> contato@ezhealth.com</li>
              <li><span className="font-semibold text-DarkBlue dark:text-white">Telefone:</span> (XX) XXXX-XXXX</li>
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}