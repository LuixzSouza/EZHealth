'use client';

import { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const SALAS_POLLING_INTERVAL = 30000; // Intervalo de polling para salas (30 segundos)

// --- Sub-componente: Modal de Confirmação ---
// (Seu código para ConfirmationModal permanece o mesmo)
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[53] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <Heading as="h3" text={title} colorClass="dark:text-orangeDark text-orange" className="mb-4 text-xl sm:text-2xl text-center" />
        <ParagraphBlue className="mb-6 text-center text-slate-700 dark:text-slate-300">{message}</ParagraphBlue>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Cancelar</button>
          <ButtonPrimary onClick={onConfirm}>Confirmar</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

// --- Sub-componente: Modal de Alerta/Mensagem ---
// (Seu código para AlertDialog permanece o mesmo)
function AlertDialog({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[54] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <Heading as="h3" text={title} colorClass="dark:text-orangeDark text-orange" className="mb-4 text-xl sm:text-2xl text-center" />
        <ParagraphBlue className="mb-6 text-center text-slate-700 dark:text-slate-300">{message}</ParagraphBlue>
        <div className="flex justify-center">
          <ButtonPrimary onClick={onClose}>Entendido</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

export function SalasAdminTab() {
  const [salas, setSalas] = useState([]);
  const [loadingSalas, setLoadingSalas] = useState(true); // Renomeado para clareza
  const [errorSalas, setErrorSalas] = useState(null);    // Renomeado para clareza
  const [isPollingSalas, setIsPollingSalas] = useState(false); // Para feedback de polling

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]); // Esta lista de pacientes é de /api/patients

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  const fetchSalas = useCallback(async (isPoll = false) => {
    if (!isPoll) {
      setLoadingSalas(true);
    } else {
      setIsPollingSalas(true);
    }
    setErrorSalas(null);
    try {
      const resp = await fetch("/api/salas"); // Caminho relativo
      if (!resp.ok) {
        throw new Error(`Erro ao buscar salas! Status: ${resp.status}`);
      }
      const data = await resp.json();
      setSalas(data);
    } catch (err) {
      console.error("Erro ao buscar salas:", err);
      setErrorSalas("Não foi possível carregar as salas."); // Mensagem mais concisa
    } finally {
      if (!isPoll) {
        setLoadingSalas(false);
      } else {
        setIsPollingSalas(false);
      }
    }
  }, []); // useCallback para estabilizar a função

  const fetchDoctors = useCallback(async () => { // Envolvido em useCallback
    try {
      const resp = await fetch("/api/medicos"); // Caminho relativo
      if (!resp.ok) {
        throw new Error(`Erro ao buscar médicos! Status: ${resp.status}`);
      }
      const data = await resp.json();
      setDoctors(data);
    } catch (err) {
      console.error("Erro ao buscar médicos:", err);
      // Poderia definir um estado de erro para médicos se necessário
    }
  }, []);

  const fetchPatients = useCallback(async () => { // Envolvido em useCallback
    try {
      // Assumindo que /api/patients retorna uma lista de pacientes com { id, name }
      // Se a estrutura for diferente, ajuste o mapeamento ou o uso de getPatientName
      const resp = await fetch("/api/patients"); // Caminho relativo
      if (!resp.ok) {
        throw new Error(`Erro ao buscar pacientes! Status: ${resp.status}`);
      }
      const data = await resp.json();
      setPatients(data); // Espera-se que data seja um array de pacientes { id, name, ... }
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
      // Poderia definir um estado de erro para pacientes se necessário
    }
  }, []);

  // Efeito para buscar dados iniciais e configurar polling para salas
  useEffect(() => {
    fetchSalas(false); // Busca inicial de salas
    fetchDoctors();
    fetchPatients();

    const intervalId = setInterval(() => {
      fetchSalas(true); // Polling para salas
    }, SALAS_POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchSalas, fetchDoctors, fetchPatients]); // Incluindo todas as funções de fetch memoizadas

  const openModal = (room = null) => {
    setCurrentRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleSaveRoom = async (roomData) => {
    if (!roomData.name || !roomData.name.trim()) { // Checagem mais robusta
      setAlertTitle("Atenção!");
      setAlertMessage("O nome da sala não pode ser vazio.");
      setIsAlertDialogOpen(true);
      return;
    }

    // Prepara os dados a serem enviados, excluindo o ID do corpo para PUT
    const dataToSend = {
      name: roomData.name,
      type: roomData.type,
      doctorId: roomData.doctorId || null, // Garante null se vazio
      patientId: roomData.patientId || null, // Garante null se vazio
    };

    try {
      let resp;
      let successMessage = "";

      if (currentRoom && currentRoom.id) { // Editando uma sala existente
        // Para PUT, envia o ID na query string
        resp = await fetch(`/api/salas?id=${currentRoom.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend), // Envia apenas os dados atualizáveis
        });
        successMessage = "Sala atualizada com sucesso!";
      } else { // Adicionando uma nova sala
        resp = await fetch("/api/salas", { // Caminho relativo
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        successMessage = "Sala adicionada com sucesso!";
      }

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ message: "Erro desconhecido ao processar resposta." }));
        throw new Error(errorData.message || `Erro HTTP! Status: ${resp.status}`);
      }

      setAlertTitle("Sucesso!");
      setAlertMessage(successMessage);
      setIsAlertDialogOpen(true);

      fetchSalas(); // Rebusca as salas para atualizar a UI
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar sala:", err);
      setAlertTitle("Erro!");
      setAlertMessage("Não foi possível salvar a sala: " + err.message);
      setIsAlertDialogOpen(true);
    }
  };

  const handleDelete = (roomId) => {
    setConfirmTitle("Confirmar Exclusão");
    setConfirmMessage("Tem certeza que deseja excluir esta sala? Esta ação é irreversível e pode desocupar médico e paciente dela, se aplicável.");
    setConfirmAction(() => async () => {
      try {
        const resp = await fetch(`/api/salas?id=${roomId}`, { // Caminho relativo e ID na query
          method: "DELETE"
        });

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => ({ message: "Erro desconhecido ao processar resposta." }));
          throw new Error(errorData.message || `Erro HTTP! Status: ${resp.status}`);
        }

        setAlertTitle("Sucesso!");
        setAlertMessage("Sala removida com sucesso!");
        setIsAlertDialogOpen(true);

        fetchSalas(); // Rebusca as salas
      } catch (err) {
        console.error("Erro ao remover sala:", err);
        setAlertTitle("Erro!");
        setAlertMessage("Não foi possível remover a sala: " + err.message);
        setIsAlertDialogOpen(true);
      } finally {
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  // Funções para obter nomes. Assumem que 'doctors' e 'patients' são arrays de objetos com 'id' e 'nome'/'name'.
  const getDoctorName = (doctorId) => {
    if (!doctorId) return 'Não atribuído';
    return doctors.find(doc => doc.id === doctorId)?.nome || 'Médico desconhecido';
  };

  const getPatientName = (patientId) => {
    if (!patientId) return 'Nenhum';
    // Assume que sua API /api/patients retorna objetos com 'id' e 'name'
    return patients.find(pat => pat.id === patientId)?.name || 'Paciente desconhecido';
  };


  function RoomFormModal({ isOpen, onClose, onSave, roomToEdit, doctors, patients: allPatients, salas: allSalas }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('Geral');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState('');
  
    useEffect(() => {
      if (isOpen) {
        setName(roomToEdit?.name || '');
        setType(roomToEdit?.type || 'Geral');
        setSelectedDoctorId(roomToEdit?.doctorId || '');
        setSelectedPatientId(roomToEdit?.patientId || '');
      } else {
        // Resetar ao fechar para não persistir dados entre aberturas
        setName('');
        setType('Geral');
        setSelectedDoctorId('');
        setSelectedPatientId('');
      }
    }, [isOpen, roomToEdit]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ name, type, doctorId: selectedDoctorId, patientId: selectedPatientId });
    };
  
    if (!isOpen) return null;

    // Pacientes disponíveis: aqueles não atribuídos a NENHUMA OUTRA sala.
    // Se estiver editando, o paciente atual da sala também deve ser uma opção válida.
    const availablePatients = allPatients.filter(p => {
      const roomPatientIsIn = allSalas.find(s => s.patientId === p.id);
      if (!roomPatientIsIn) return true; // Paciente está livre
      if (roomToEdit && roomPatientIsIn.id === roomToEdit.id) return true; // Paciente está nesta sala (editando)
      return false; // Paciente está em outra sala
    });
  
    return (
      <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[52] p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <Heading as="h3" text={roomToEdit ? "Editar Sala" : "Adicionar Nova Sala"} colorClass="dark:text-orangeDark text-orange" className="mb-4 text-lg sm:text-lg text-center" />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="roomName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Sala:</label>
              <input type="text" id="roomName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
            </div>
            <div className="mb-4">
              <label htmlFor="roomType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo da Sala:</label>
              <select id="roomType" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                <option value="Geral">Geral</option>
                <option value="Consultório">Consultório</option>
                <option value="Emergência">Emergência</option>
                <option value="Exames">Exames</option>
                <option value="Internação">Internação</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="doctor" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Médico na Sala:</label>
              <select id="doctor" value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                <option value="">-- Nenhum Médico --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.nome}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="patient" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paciente na Sala:</label>
              <select id="patient" value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                <option value="">-- Nenhum Paciente --</option>
                {availablePatients.map(pat => (
                  <option key={pat.id} value={pat.id}>{pat.name}</option>
                ))}
                {/* Se o paciente atualmente na sala (ao editar) não estiver na lista de `availablePatients` 
                    (ex: foi inativado mas ainda está na sala), adiciona-o como opção.
                    Isto é um caso de borda, idealmente `availablePatients` já o conteria se ele existir e estiver nesta sala.
                */}
                {roomToEdit && roomToEdit.patientId && !availablePatients.some(p => p.id === roomToEdit.patientId) && (
                    <option key={roomToEdit.patientId} value={roomToEdit.patientId}>
                        {getPatientName(roomToEdit.patientId)} (Atualmente na sala)
                    </option>
                )}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Cancelar</button>
              <ButtonPrimary type="submit">{roomToEdit ? "Salvar Alterações" : "Adicionar Sala"}</ButtonPrimary>
            </div>
          </form>
        </div>
      </div>
    );
  }
  

  if (loadingSalas) { // Usa o estado de loading específico para salas
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-slate-500 dark:text-slate-400">Carregando salas...</p>
      </div>
    );
  }

  if (errorSalas) { // Usa o estado de erro específico para salas
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <p className="text-red-500 dark:text-red-400">{errorSalas}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading as="h2" text="Gerenciamento de Salas" colorClass="dark:text-orangeDark text-orange" className="mb-3 text-2xl sm:text-3xl" />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Visualize, adicione, edite e organize as salas de atendimento.
        {isPollingSalas && <span className="ml-2 text-xs opacity-70">(Atualizando...)</span>}
      </ParagraphBlue>

      <div className="mb-4 sm:mb-6 text-right">
        <ButtonPrimary onClick={() => openModal()} className="w-full sm:w-auto inline-flex items-center gap-2">
          <PlusCircleIcon className="h-5 w-5" />
          Adicionar Sala
        </ButtonPrimary>
      </div>

      {salas.length === 0 ? (
        <ParagraphBlue className="text-center py-6 sm:py-8 text-slate-500 dark:text-slate-400">
          Nenhuma sala cadastrada. Adicione uma nova sala para começar!
        </ParagraphBlue>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">Nome da Sala</th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">Tipo</th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">Médico na Sala</th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">Paciente na Sala</th>
                <th scope="col" className="relative px-3 py-2 sm:px-6 sm:py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-slate-200 dark:divide-slate-700">
              {salas.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">{room.name}</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{room.type}</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{getDoctorName(room.doctorId)}</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    <span className={`${room.patientId ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {getPatientName(room.patientId)}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(room)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-3 p-1 rounded hover:bg-blue-100 dark:hover:bg-slate-700" title="Editar">
                      <PencilSquareIcon className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1 rounded hover:bg-red-100 dark:hover:bg-slate-700" title="Excluir">
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoomFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveRoom}
        roomToEdit={currentRoom}
        doctors={doctors}
        patients={patients} // Passa a lista completa de pacientes para o modal
        salas={salas}       // Passa a lista de salas para o modal (usado no filtro de pacientes)
        getPatientName={getPatientName} // Passa a função para o modal, caso seja útil lá dentro
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
        title={confirmTitle}
        message={confirmMessage}
      />
      <AlertDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </div>
  );
}