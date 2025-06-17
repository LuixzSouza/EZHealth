'use client';

import { useState, useEffect, useCallback, useMemo } from 'react'; // ✅ NOVO: import useMemo
import { useForm } from 'react-hook-form';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// ... (O restante dos componentes ConfirmationModal, AlertDialog e RoomFormModal permanecem exatamente os mesmos)

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h3 className="text-xl font-bold mb-4 text-orange-500">{title}</h3>
                <p className="mb-6 text-slate-700 dark:text-slate-300">{message}</p>
                <div className="flex justify-center gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancelar</button>
                    <ButtonPrimary onClick={onConfirm}>Confirmar</ButtonPrimary>
                </div>
            </div>
        </div>
    );
}

function AlertDialog({ isOpen, onClose, title, message }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h3 className="text-xl font-bold mb-4 text-orange-500">{title}</h3>
                <p className="mb-6 text-slate-700 dark:text-slate-300">{message}</p>
                <div className="flex justify-center">
                    <ButtonPrimary onClick={onClose}>Entendido</ButtonPrimary>
                </div>
            </div>
        </div>
    );
}

function RoomFormModal({ isOpen, onClose, onSave, roomToEdit, doctors }) {
  const { register, handleSubmit, reset } = useForm();
  
  useEffect(() => {
    if (isOpen) {
      reset({
        name: roomToEdit?.name || '',
        type: roomToEdit?.type || 'Geral',
        doctorId: roomToEdit?.doctorId?._id || '',
        // O campo patientId não é mais editável aqui
      });
    }
  }, [isOpen, roomToEdit, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-orange-500 text-center">{roomToEdit ? "Editar Sala" : "Adicionar Nova Sala"}</h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Nome da Sala</label>
            <input id="name" type="text" {...register("name", { required: true })} className="mt-1 block w-full input-style p-1 text-black" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium">Tipo da Sala</label>
            <select id="type" {...register("type")} className="mt-1 block w-full input-style p-1 text-black">
              <option value="Geral">Geral</option>
              <option value="Consultório">Consultório</option>
              <option value="Emergência">Emergência</option>
              <option value="Triagem">Triagem</option>
            </select>
          </div>
          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium">Médico Principal (Opcional)</label>
            <select id="doctorId" {...register("doctorId")} className="mt-1 block w-full input-style p-1 text-black">
              <option value="">Nenhum Médico</option>
              {/* A lista de 'doctors' aqui já virá filtrada do componente pai */}
              {doctors?.map(doc => <option key={doc._id} value={doc._id}>{doc.nome}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md">Cancelar</button>
            <ButtonPrimary type="submit">{roomToEdit ? "Salvar Alterações" : "Adicionar Sala"}</ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}


export function SalasAdminTab() {
  const [salas, setSalas] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [salasRes, doctorsRes] = await Promise.all([
        fetch('/api/salas'),
        fetch('/api/medicos?status=Ativo'),
      ]);
      
      const salasResult = await salasRes.json();
      const doctorsResult = await doctorsRes.json();

      if (!salasResult.success) throw new Error(salasResult.message);
      if (!doctorsResult.success) throw new Error(doctorsResult.message);
      
      setSalas(salasResult.data);
      setDoctors(doctorsResult.data);
    } catch (err) {
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // ✅ NOVO: Hook useMemo para calcular médicos disponíveis para o formulário
  const availableDoctors = useMemo(() => {
    // 1. Pega os IDs de todos os médicos já alocados em alguma sala.
    const assignedDoctorIds = salas
      .map(sala => sala.doctorId?._id)
      .filter(id => id != null); // Filtra para remover valores nulos ou indefinidos

    // 2. Filtra a lista principal de médicos
    return doctors.filter(doctor => {
      // O médico que está na sala que estamos editando atualmente
      const isDoctorInCurrentRoom = doctor._id === currentRoom?.doctorId?._id;
      
      // O médico está disponível se:
      // a) Ele não está na lista de médicos já alocados, OU
      // b) Ele é o médico que já está na sala que estamos editando.
      return !assignedDoctorIds.includes(doctor._id) || isDoctorInCurrentRoom;
    });
  }, [salas, doctors, currentRoom]); // Recalcula quando salas, médicos ou a sala atual mudarem

  const handleSaveRoom = async (roomData) => {
    try {
      const isEditing = !!currentRoom;
      const url = isEditing ? `/api/salas?id=${currentRoom._id}` : '/api/salas';
      const method = isEditing ? 'PUT' : 'POST';

      const resp = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(roomData) });
      const result = await resp.json();
      if (!result.success) throw new Error(result.message);

      setAlertTitle("Sucesso!");
      setAlertMessage(`Sala ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`);
      setIsAlertDialogOpen(true);
      
      fetchData();
    } catch (err) {
      setAlertTitle("Erro!");
      setAlertMessage("Não foi possível salvar a sala: " + err.message);
      setIsAlertDialogOpen(true);
    } finally {
      setIsModalOpen(false);
    }
  };
  
  const handleDelete = (room) => {
    setConfirmTitle("Confirmar Exclusão");
    setConfirmMessage(`Tem certeza que deseja excluir a sala "${room.name}"? Esta ação não pode ser desfeita.`);
    setConfirmAction(() => async () => {
      try {
        const resp = await fetch(`/api/salas?id=${room._id}`, { method: 'DELETE' });
        const result = await resp.json();
        if (!result.success) throw new Error(result.message);
        
        setAlertTitle("Sucesso!");
        setAlertMessage("Sala removida com sucesso!");
        setIsAlertDialogOpen(true);

        fetchData();
      } catch (err) {
        setAlertTitle("Erro!");
        setAlertMessage("Não foi possível remover a sala: " + err.message);
        setIsAlertDialogOpen(true);
      } finally {
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };
  
  return (
    <div className="p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading as="h2" text="Gerenciamento de Salas" colorClass="dark:text-orangeDark text-orange" className="mb-3" />
      <ParagraphBlue className="mb-6">Adicione, edite e organize as salas de atendimento.</ParagraphBlue>
      
      <div className="mb-6 text-right">
        <ButtonPrimary onClick={() => { setCurrentRoom(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2">
          <PlusCircleIcon className="h-5 w-5" /> Adicionar Sala
        </ButtonPrimary>
      </div>

      {loading && salas.length === 0 ? <p className="text-center py-8">Carregando...</p> : 
        error ? <p className="text-center py-8 text-red-500">{error}</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salas.map((room) => (
            <div key={room._id} className={`rounded-lg shadow-lg border p-5 flex flex-col justify-between ${room.patientId ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-800">{room.name}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${room.patientId ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                    {room.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{room.type}</p>
                
                <div className="text-sm space-y-2 text-slate-700">
                    <div className="flex items-center gap-2"><UserGroupIcon className="h-5 w-5" /><span>Paciente: <span className="font-semibold">{room.patientId?.nome || 'Nenhum'}</span></span></div>
                    <div className="flex items-center gap-2"><UserIcon className="h-5 w-5" /><span>Médico: <span className="font-semibold">{room.doctorId?.nome || 'Não atribuído'}</span></span></div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => { setCurrentRoom(room); setIsModalOpen(true); }} className="p-2 rounded-md hover:bg-slate-200" title="Editar"><PencilSquareIcon className="h-5 w-5" /></button>
                <button onClick={() => handleDelete(room)} className="p-2 rounded-md hover:bg-slate-200" title="Excluir"><TrashIcon className="h-5 w-5 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ ALTERADO: Passa a nova lista 'availableDoctors' para o modal */}
      <RoomFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveRoom} 
        roomToEdit={currentRoom} 
        doctors={availableDoctors} 
      />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmAction} title={confirmTitle} message={confirmMessage} />
      <AlertDialog isOpen={isAlertDialogOpen} onClose={() => setIsAlertDialogOpen(false)} title={alertTitle} message={alertMessage} />
    </div>
  );
}