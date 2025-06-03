'use client';

import { useState, useEffect } from "react";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";

// Mova os dados de exemplo para fora do componente se você precisar deles globalmente
// Ou remova se eles não são mais usados após buscar da API.
// Para este exemplo, vou mantê-los como um fallback para o formulário.
const defaultDoctors = [
    { nome: "Dr. João Silva", foto: "/images/doctors/dr_joao_silva.png" },
    { nome: "Dra. Ana Paula", foto: "/images/doctors/dra_ana_paula.png" },
    { nome: "Dr. Marcos Vinícius", foto: "/images/doctors/dr_marcos_vinicius.png" },
    { nome: "Dra. Camila Ribeiro", foto: "/images/doctors/dra_camila_ribeiro.png" },
    { nome: "Dra. Larissa Mendes", foto: "/images/doctors/dra_larissa_mendes.png" },
    { nome: "Dr. Rafael Albuquerque", foto: "/images/doctors/dr_rafael_albuquerque.png" },
    { nome: "Dra. Beatriz Costa", foto: "/images/doctors/dra_beatriz_costa.png" },
    { nome: "Dr. Henrique Souza", foto: "/images/doctors/dr_henrique_souza.png" },
];

export function AgendaTab() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // ALTERAÇÃO AQUI: Começa com null, será preenchido pelo useEffect
    const [medicoLogadoNome, setMedicoLogadoNome] = useState(null);
    // ALTERAÇÃO AQUI: Também precisamos da foto do médico logado para o POST
    const [medicoLogadoFoto, setMedicoLogadoFoto] = useState('');

    // Função para buscar as consultas
    const fetchAppointments = async (nomeDoMedico) => { // Recebe o nome como argumento
        if (!nomeDoMedico) { // Garante que só busca se tiver nome
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // A URL já está correta para filtrar
            const response = await fetch(`/api/agenda?medicoNome=${encodeURIComponent(nomeDoMedico)}`);

            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            console.error("Erro ao buscar agenda do médico:", err);
            setError("Não foi possível carregar a agenda do médico. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // LER O MÉDICO LOGADO DO LOCALSTORAGE AQUI
        const medicoLogado = localStorage.getItem("medicoLogado"); // Ou "adminLogado", dependendo de como você guarda
        if (medicoLogado) {
            const medicoData = JSON.parse(medicoLogado);
            setMedicoLogadoNome(medicoData.nome);
            // Procura a foto na lista de defaultDoctors ou de onde você as tiver
            const foto = defaultDoctors.find(doc => doc.nome === medicoData.nome)?.foto || '';
            setMedicoLogadoFoto(foto);
            
            // Chama fetchAppointments com o nome *recém-obtido*
            fetchAppointments(medicoData.nome); 
        } else {
            // Se não houver médico logado, ou se estiver em um contexto que não é de médico
            // Você pode decidir o que fazer aqui, talvez redirecionar ou mostrar uma mensagem.
            setLoading(false);
            setError("Nenhum médico logado encontrado para exibir a agenda.");
        }
    }, []); // Array de dependências vazio para rodar apenas na montagem

    // Removi a dependência [medicoLogadoNome] do useEffect que chama fetchAppointments,
    // pois a chamada inicial é feita no useEffect de montagem após obter o nome.
    // Se o nome do médico puder mudar durante a sessão sem recarregar a página,
    // talvez precise de um mecanismo mais sofisticado.

    const handleAddAppointment = () => {
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
    };

    const handleSaveNewAppointment = async (newAppointmentData) => {
        try {
            if (!medicoLogadoNome) {
                throw new Error("Nome do médico não disponível para adicionar consulta.");
            }

            const appointmentToSave = {
                ...newAppointmentData,
                medico: { // Associa a consulta ao médico logado
                    nome: medicoLogadoNome,
                    foto: medicoLogadoFoto // Inclui a foto obtida do localStorage (ou defaultDoctors)
                },
                // Opcional: Adicionar patientId se houver sistema de pacientes
                // Opcional: status da consulta (agendada, confirmada, realizada, cancelada)
            };

            const response = await fetch('/api/agenda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao adicionar a consulta.');
            }

            alert('Consulta adicionada com sucesso!');
            handleCloseModal();
            // CHAMA fetchAppointments com o nome atual, para garantir a atualização
            fetchAppointments(medicoLogadoNome); 
        } catch (err) {
            console.error("Erro ao adicionar consulta:", err);
            alert('Erro ao adicionar consulta: ' + err.message);
        }
    };


    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
            <Heading
                as="h2"
                text={`Agenda de ${medicoLogadoNome || 'Carregando...'}`} // Exibe "Carregando..." enquanto busca o nome
                colorClass="dark:text-orangeDark text-orange"
                className="mb-3 text-2xl sm:text-3xl"
            />
            <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Seus próximos compromissos.</ParagraphBlue>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">Carregando agenda...</p>
            ) : error ? (
                <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8 text-sm sm:text-base">{error}</p>
            ) : appointments.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4">
                    {appointments.map((appointment) => (
                        <li key={appointment._id} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md flex flex-col sm:flex-row justify-between sm:items-center">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-base sm:text-lg font-semibold text-DarkBlue dark:text-white leading-tight">
                                    {new Date(appointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {appointment.time}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.description}</p>
                                {/* Opcional: exibir o nome do paciente aqui, se o documento tiver */}
                                {appointment.patientName && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Paciente: {appointment.patientName}</p>
                                )}
                            </div>
                            {/* Você pode adicionar botões de Ações aqui */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhum compromisso agendado para {medicoLogadoNome || 'este médico'}.</p>
            )}

            <div className="mt-6 sm:mt-8 text-center">
                <ButtonPrimary onClick={handleAddAppointment} variant="primary" className="w-full sm:w-auto">
                    + Adicionar Nova Consulta
                </ButtonPrimary>
            </div>

            {showAddModal && (
                <AddAppointmentModal 
                    onClose={handleCloseModal} 
                    onSave={handleSaveNewAppointment} 
                    medicoNome={medicoLogadoNome} // Passa o nome do médico logado para o modal (apenas para info, não para salvar)
                />
            )}
        </div>
    );
}

// --- Componente de Modal para Adicionar Consulta (Sem alterações, apenas incluído para contexto) ---
function AddAppointmentModal({ onClose, onSave, medicoNome }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [patientName, setPatientName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || !time || !description || !patientName) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        onSave({ date, time, description, patientName });
    };

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Adicionar Nova Consulta</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-black dark:text-white">
                            Nome do Paciente:
                        </label>
                        <input
                            type="text"
                            id="patientName"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 focus:border-orange focus:ring-orange text-black p-2 bg-white dark:bg-zinc-800"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-black dark:text-white">
                            Data:
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 focus:border-orange focus:ring-orange text-black p-2 bg-white dark:bg-zinc-800"
                            min={minDate}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-black dark:text-white">
                            Hora:
                        </label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 focus:border-orange focus:ring-orange text-black p-2 bg-white dark:bg-zinc-800"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-black dark:text-white">
                            Descrição:
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 focus:border-orange focus:ring-orange text-black p-2 bg-white dark:bg-zinc-800"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-black dark:border-white rounded-md text-sm font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                        >
                            Cancelar
                        </button>
                        <ButtonPrimary type="submit">
                            Salvar Consulta
                        </ButtonPrimary>
                    </div>
                </form>
            </div>
        </div>
    );
}