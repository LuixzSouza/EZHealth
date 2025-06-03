// src/app/politica-de-privacidade/page.js ou src/pages/politica-de-privacidade.js
'use client'; // Necessário para componentes no lado do cliente

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header'; // Verifique o caminho correto
import { Heading } from '@/components/typography/Heading'; // Verifique o caminho correto
import { ParagraphBlue } from '@/components/theme/ParagraphBlue'; // Verifique o caminho correto

export default function PoliticaDePrivacidadePage() {
  useEffect(() => {
    document.title = "Política de Privacidade - EZHealth";
  }, []);

  return (
    <>
      <Header /> {/* Inclui o cabeçalho do seu site */}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 mt-8 mb-12">
        <article className="bg-white dark:bg-themeDark p-6 sm:p-8 rounded-lg shadow-lg">
          <Heading
            as="h1"
            text="Política de Privacidade"
            colorClass="text-DarkBlue dark:text-orangeDark"
            className="mb-6 text-3xl sm:text-4xl text-center"
          />
          <ParagraphBlue className="text-sm sm:text-base text-center mb-8">
            Última atualização: 3 de junho de 2025
          </ParagraphBlue>

          <section className="mb-8">
            <Heading
              as="h2"
              text="1. Informações que Coletamos"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue className="mb-2">
              Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
            </ParagraphBlue>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Informações Pessoais Identificáveis (Dados Cadastrais):</span> Nome completo, data de nascimento, CPF, endereço de e-mail, número de telefone, endereço, informações de convênio médico (se aplicável), dados de login e senha (criptografados).
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Informações de Saúde (Dados de Triagem e Atendimento):</span> Sinais vitais, sintomas, histórico médico, medicamentos em uso, classificação de risco e informações de atendimento (médico, sala, senha). Estas são coletadas com seu consentimento explícito.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Dados de Uso e Navegação:</span> Endereço IP, tipo de navegador, páginas visitadas, tempo de permanência, cliques, cookies e tecnologias de rastreamento.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="2. Como Usamos Suas Informações"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue className="mb-2">
              Utilizamos suas informações para diversas finalidades, sempre visando aprimorar sua experiência e garantir a segurança:
            </ParagraphBlue>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Para Fornecer Serviços Médicos:</span> Realizar triagens, gerenciar atendimento e histórico, facilitar comunicação com profissionais.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Para Gerenciar Sua Conta:</span> Criar cadastro, permitir acesso seguro, enviar notificações.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Para Melhorar Nossos Serviços:</span> Análise de uso, personalização, pesquisas internas.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Para Comunicação:</span> Responder a dúvidas, enviar comunicados (com permissão).
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Para Segurança e Conformidade Legal:</span> Prevenir fraudes, cumprir obrigações legais, proteger direitos.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="3. Compartilhamento de Informações"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue className="mb-2">
              A EZHealth se compromete a não vender, alugar ou comercializar suas informações pessoais. Compartilhamos seus dados apenas nas seguintes situações:
            </ParagraphBlue>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Com Profissionais de Saúde:</span> Para garantir diagnóstico e tratamento adequados.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Com Prestadores de Serviços:</span> Empresas que nos auxiliam na operação, sob obrigações de confidencialidade.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Com Convênios Médicos:</span> Para faturamento e validação de serviços.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Para Fins Legais:</span> Se exigido por lei ou ordem judicial.
              </li>
              <li className="mb-2">
                <span className="font-semibold text-DarkBlue dark:text-white">Com Seu Consentimento:</span> Em outras situações específicas.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="4. Armazenamento e Segurança dos Dados"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue className="mb-2">
              Empregamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações contra acesso não autorizado, uso indevido ou divulgação. Isso inclui criptografia, controles de acesso, firewalls e backups regulares.
            </ParagraphBlue>
            <ParagraphBlue className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Apesar de nossos esforços, lembre-se que nenhum sistema é 100% impenetrável.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="5. Cookies e Tecnologias de Rastreamento"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue className="mb-2">
              Nosso site utiliza cookies e tecnologias semelhantes para melhorar sua experiência, lembrar preferências e analisar o tráfego. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="6. Seus Direitos de Privacidade"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue className="mb-2">
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direitos sobre seus dados pessoais, incluindo:
            </ParagraphBlue>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Acesso:</span> Solicitar acesso aos seus dados.</li>
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Correção:</span> Solicitar a correção de dados.</li>
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Exclusão:</span> Solicitar a exclusão de seus dados.</li>
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Portabilidade:</span> Solicitar a portabilidade dos seus dados.</li>
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Revogação do Consentimento:</span> Retirar seu consentimento.</li>
              <li className="mb-2"><span className="font-semibold text-DarkBlue dark:text-white">Informação:</span> Ser informado sobre compartilhamento de dados.</li>
            </ul>
            <ParagraphBlue className="mt-4">
              Para exercer esses direitos, entre em contato conosco pelos canais abaixo.
            </ParagraphBlue>
          </section>

          <section className="mb-8">
            <Heading
              as="h2"
              text="7. Contato"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              Para dúvidas sobre esta Política ou nossas práticas de dados:
            </ParagraphBlue>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300 mt-2">
              <li><span className="font-semibold text-DarkBlue dark:text-white">E-mail:</span> privacidade@ezhealth.com</li>
              <li><span className="font-semibold text-DarkBlue dark:text-white">Telefone:</span> (XX) XXXX-XXXX</li>
              <li><span className="font-semibold text-DarkBlue dark:text-white">Endereço:</span> [Seu Endereço aqui, se desejar]</li>
            </ul>
          </section>

          <section>
            <Heading
              as="h2"
              text="8. Alterações nesta Política de Privacidade"
              colorClass="text-DarkBlue dark:text-orange"
              className="mb-4 text-xl sm:text-2xl"
            />
            <ParagraphBlue>
              Reservamo-nos o direito de modificar esta Política. Alterações serão publicadas aqui, e a Última atualização será revisada. Recomendamos revisão periódica.
            </ParagraphBlue>
          </section>
        </article>
      </main>
    </>
  );
}