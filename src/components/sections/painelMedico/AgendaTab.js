'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// ✅ NOVO: Importa o useForm para o modal
import { useForm } from 'react-hook-form'; 
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { CalendarDaysIcon, ClockIcon, UserIcon, ClipboardDocumentListIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// --- Hook customizado para buscar dados (sem alterações) ---
function useFetchData(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!url) { 
                setLoading(false);
                return;
            };
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            } else {
                throw new Error(result.message || 'Falha ao buscar dados.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url]); 

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// ✅ NOVO: Componente para exibir o status da consulta com cores
function StatusBadge({ status }) {
    const statusStyles = {
        'Agendado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Em Atendimento': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Concluído': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
}

// ✅ NOVO: Componente de Card para um único agendamento
function AppointmentCard({ appointment }) {
    const router = useRouter();
    const appointmentDate = new Date(appointment.date);

    return (
        <li className="bg-white dark:bg-zinc-800/50 p-4 sm:p-5 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col gap-4 transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700">
            {/* Cabeçalho do Card: Data e Status */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-3 text-DarkBlue dark:text-white font-semibold">
                    <CalendarDaysIcon className="h-6 w-6 text-orange-500" />
                    <span>{appointmentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <ClockIcon className="h-6 w-6 text-orange-500" />
                    <span>{appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <StatusBadge status={appointment.status} />
            </div>

            {/* Corpo do Card: Paciente e Descrição */}
            <div className="flex-grow flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-zinc-500" />
                    <span className="text-zinc-800 dark:text-zinc-200">
                        Paciente: <span className="font-bold">{appointment.patientId?.nome || 'Não informado'}</span>
                    </span>
                </div>
                <div className="flex items-start gap-3">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {appointment.description || 'Nenhum motivo especificado.'}
                    </p>
                </div>
            </div>

            {/* Rodapé do Card: Ações */}
            <div className="mt-2 pt-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-end">
                <button 
                    onClick={() => alert(`Navegando para o prontuário de ${appointment.patientId?.nome}`)} // Em uma app real: router.push(`/prontuario/${appointment.patientId?._id}`)
                    className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-800 dark:text-orange-500 dark:hover:text-orange-400 transition"
                >
                    Ver Prontuário
                    <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
        </li>
    );
}


// --- Componente da Aba de Agenda (sem alterações) ---
export function AgendaTab() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: allDoctors, loading: loadingAllDoctors } = useFetchData('/api/medicos?status=Ativo');
  const [loggedInDoctor, setLoggedInDoctor] = useState(null);

  useEffect(() => {
    if (allDoctors && allDoctors.length > 0 && !loggedInDoctor) {
      setLoggedInDoctor(allDoctors[0]);
    }
  }, [allDoctors, loggedInDoctor]);

  const fetchAppointments = useCallback(async () => {
    if (!loggedInDoctor?._id) return;

    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`/api/agenda?doctorId=${loggedInDoctor._id}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const result = await response.json();
        if (result.success) {
            setAppointments(result.data);
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        setError("Não foi possível carregar a agenda.");
    } finally {
        setLoading(false);
    }
  }, [loggedInDoctor]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const selectedDoctor = allDoctors.find(doc => doc._id === doctorId);
    if (selectedDoctor) {
      setLoggedInDoctor(selectedDoctor);
    }
  };

  const handleSaveNewAppointment = async (newAppointmentData) => {
    try {
        const response = await fetch('/api/agenda', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAppointmentData),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        
        alert('Consulta adicionada com sucesso!');
        setShowAddModal(false);
        fetchAppointments(); 
    } catch (err) {
        alert('Erro ao adicionar consulta: ' + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
        
        <div className="mb-6 p-4 border-2 border-dashed border-orange rounded-lg bg-orange/5">
            <label htmlFor="doctorSelector" className="block text-sm font-bold text-orange mb-2">Simulador de Login</label>
            <select
                id="doctorSelector"
                value={loggedInDoctor?._id || ''}
                onChange={handleDoctorChange}
                disabled={loadingAllDoctors || !allDoctors}
                className="w-full p-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-orange dark:bg-zinc-800 dark:border-zinc-700"
            >
                {loadingAllDoctors ? (
                    <option>Carregando médicos...</option>
                ) : (
                    allDoctors?.map(doc => (
                        <option key={doc._id} value={doc._id}>{doc.nome}</option>
                    ))
                )}
            </select>
        </div>

        <Heading
            as="h2"
            text={`Agenda de ${loggedInDoctor?.nome || 'Carregando...'}`}
            colorClass="dark:text-orangeDark text-orange"
            className="mb-3 text-2xl sm:text-3xl"
        />
        <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Seus próximos compromissos.</ParagraphBlue>

        {loading ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">Carregando agenda...</p>
        ) : error ? (
            <p className="text-red-500 dark:text-red-400 text-center py-8">{error}</p>
        ) : appointments.length > 0 ? (
            // ✅ ALTERADO: Mapeamento agora usa o novo componente AppointmentCard
            <ul className="space-y-4">
                {appointments.map((appointment) => (
                   <AppointmentCard key={appointment._id} appointment={appointment} />
                ))}
            </ul>
        ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">Nenhum compromisso agendado para este médico.</p>
        )}

        <div className="mt-8 text-center">
            <ButtonPrimary onClick={() => setShowAddModal(true)}>
                + Adicionar Nova Consulta
            </ButtonPrimary>
        </div>

        {showAddModal && (
            <AddAppointmentModal 
                onClose={() => setShowAddModal(false)} 
                onSave={handleSaveNewAppointment}
                loggedInDoctor={loggedInDoctor}
            />
        )}
    </div>
  );
}


// --- ✅✅✅ COMPONENTE DO MODAL TOTALMENTE REFATORADO ✅✅✅ ---
function AddAppointmentModal({ onClose, onSave, loggedInDoctor }) {
    // ✅ Centraliza os estilos dos inputs para fácil manutenção e consistência
    const inputStyle = "mt-1 block w-full rounded-md p-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 transition";
    const labelStyle = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

    // ✅ Usa o React Hook Form para gerenciar o estado e validação do formulário
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            patientId: '',
            doctorId: loggedInDoctor?._id || '', // Pré-seleciona o médico logado
            date: '',
            time: '',
            description: ''
        }
    });

    const { data: patients, loading: loadingPatients } = useFetchData('/api/patients');
    const { data: doctors, loading: loadingDoctors } = useFetchData('/api/medicos?status=Ativo');

    // ✅ Nova função de submit que recebe os dados validados do formulário
    const onFormSubmit = (data) => {
        const fullDate = new Date(`${data.date}T${data.time}`);
        onSave({
            patientId: data.patientId,
            doctorId: data.doctorId,
            date: fullDate.toISOString(),
            description: data.description
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6 text-center text-orange-600 dark:text-orange-500">Adicionar Nova Consulta</h3>
                
                {/* ✅ O formulário agora usa o handleSubmit do react-hook-form */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
                    
                    <div>
                        <label htmlFor="patientId" className={labelStyle}>Paciente *</label>
                        <select 
                            id="patientId" 
                            {...register("patientId", { required: "Selecione um paciente." })}
                            className={`${inputStyle} ${errors.patientId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                            <option value="">{loadingPatients ? 'Carregando...' : 'Selecione um paciente'}</option>
                            {patients?.map(p => <option key={p._id} value={p._id}>{p.nome}</option>)}
                        </select>
                        {errors.patientId && <p className="text-sm text-red-500 mt-1">{errors.patientId.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="doctorId" className={labelStyle}>Médico *</label>
                        <select 
                            id="doctorId"
                            {...register("doctorId", { required: "Selecione um médico." })}
                            className={`${inputStyle} ${errors.doctorId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                            <option value="">{loadingDoctors ? 'Carregando...' : 'Selecione um médico'}</option>
                            {doctors?.map(d => <option key={d._id} value={d._id}>{d.nome}</option>)}
                        </select>
                        {errors.doctorId && <p className="text-sm text-red-500 mt-1">{errors.doctorId.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="date" className={labelStyle}>Data *</label>
                            <input 
                                type="date" 
                                id="date"
                                {...register("date", { required: "A data é obrigatória." })}
                                className={`${inputStyle} ${errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="time" className={labelStyle}>Hora *</label>
                            <input 
                                type="time" 
                                id="time"
                                {...register("time", { required: "A hora é obrigatória." })}
                                className={`${inputStyle} ${errors.time ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="description" className={labelStyle}>Descrição (Motivo da consulta)</label>
                        <textarea 
                            id="description" 
                            {...register("description")}
                            rows="3" 
                            className={inputStyle}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 rounded-md text-sm font-medium bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 transition"
                        >
                            Cancelar
                        </button>
                        <ButtonPrimary type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Consulta'}
                        </ButtonPrimary>
                    </div>
                </form>
            </div>
        </div>
    );
}