'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import Image from "next/image";
import { XMarkIcon } from '@heroicons/react/24/solid';

const AVATAR_DEFAULT = "/icons/medico-avatar.svg";

// Componente de Imagem Seguro (à prova de falhas)
function SafeImage({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(AVATAR_DEFAULT);

  useEffect(() => {
    if (typeof src === 'string' && src.startsWith('http')) {
      setImgSrc(src);
    } else {
      setImgSrc(AVATAR_DEFAULT);
    }
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(AVATAR_DEFAULT);
      }}
    />
  );
}

// --- Modal Final com Todas as Funcionalidades ---
function MedicoFormModal({ isOpen, onClose, onSave, medicoToEdit }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const fotoUrl = watch('foto');
  const fotoFile = watch('fotoFile');

  useEffect(() => {
    if (fotoFile && fotoFile[0]) {
      const objectUrl = URL.createObjectURL(fotoFile[0]);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage(fotoUrl || medicoToEdit?.foto);
    }
  }, [fotoUrl, fotoFile, medicoToEdit]);
  
  useEffect(() => {
    if (isOpen) {
        if (medicoToEdit) {
            reset(medicoToEdit);
        } else {
            reset({ status: 'Ativo', foto: '' });
        }
    }
  }, [medicoToEdit, isOpen, reset]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setValue('fotoFile', event.target.files);
      setValue('foto', '');
    }
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    let finalMedicoData = { ...data };

    if (data.fotoFile && data.fotoFile[0]) {
      const formData = new FormData();
      formData.append('file', data.fotoFile[0]);
      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const result = await response.json();
        if (!result.success) throw new Error('Falha no upload da imagem.');
        finalMedicoData.foto = result.url;
      } catch (error) {
        alert("Erro no upload da foto: " + error.message);
        setIsUploading(false);
        return;
      }
    }
    
    delete finalMedicoData.fotoFile;
    if (medicoToEdit && finalMedicoData.password === '') {
        delete finalMedicoData.password;
    }

    await onSave(finalMedicoData);
    setIsUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white dark:bg-slate-800 w-full h-full md:max-w-2xl md:h-auto md:rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <Heading as="h3" text={medicoToEdit ? "Editar Médico" : "Adicionar Médico"} colorClass="dark:text-orangeDark text-orange" className="text-lg" />
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                <XMarkIcon className="h-6 w-6 text-slate-600 dark:text-slate-300"/>
            </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
                <SafeImage src={previewImage} alt="Preview" width={64} height={64} className="rounded-full object-cover w-16 h-16" />
                <div className='flex-grow'>
                    <label htmlFor="foto" className="block text-sm font-medium">URL da Foto</label>
                    <input type="url" id="foto" {...register("foto")} className="mt-1 block w-full input-style" placeholder="https://..."/>
                </div>
            </div>
            <div className="text-center text-sm font-semibold">OU</div>
            <div>
                <label htmlFor="fotoFile" className="block text-sm font-medium">Fazer Upload de Arquivo</label>
                <input type="file" id="fotoFile" onChange={handleFileChange} accept="image/png, image/jpeg" className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            
            <hr className="border-slate-200 dark:border-slate-700"/>

            <div>
                <label htmlFor="nome" className="block text-sm font-medium">Nome</label>
                <input type="text" id="nome" {...register("nome", { required: "O nome é obrigatório" })} className="mt-1 block w-full input-style" />
                 {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>
            <div>
                <label htmlFor="especialidade" className="block text-sm font-medium">Especialidade</label>
                <input type="text" id="especialidade" {...register("especialidade", { required: "A especialidade é obrigatória" })} className="mt-1 block w-full input-style" />
                 {errors.especialidade && <p className="text-red-500 text-xs mt-1">{errors.especialidade.message}</p>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input type="email" id="email" {...register("email", { required: "O email é obrigatório", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }})} className="mt-1 block w-full input-style" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          
            <div>
                <label htmlFor="password" className="block text-sm font-medium">Senha</label>
                <input 
                    type="password" 
                    id="password" 
                    placeholder={medicoToEdit ? "Deixe em branco para não alterar" : "Senha obrigatória"}
                    {...register("password", { 
                        required: !medicoToEdit ? "A senha é obrigatória" : false, 
                        minLength: !medicoToEdit || watch('password') ? { value: 6, message: "A senha deve ter no mínimo 6 caracteres" } : undefined
                    })} 
                    className="mt-1 block w-full input-style" 
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium">Status</label>
                <select id="status" {...register("status")} className="mt-1 block w-full input-style">
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="De Férias">De Férias</option>
                </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancelar</button>
            <ButtonPrimary type="submit" disabled={isUploading}>{isUploading ? 'Salvando...' : (medicoToEdit ? "Salvar Alterações" : "Adicionar Médico")}</ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MedicosAdminTab() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicoToEdit, setMedicoToEdit] = useState(null);

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/medicos');
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setMedicos(result.data);
    } catch (err) {
      setError("Não foi possível carregar os médicos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicos(); }, []);

  const handleSaveMedico = async (medicoData) => {
    try {
      const isEditing = !!medicoToEdit;
      const url = isEditing ? `/api/medicos?id=${medicoToEdit._id}` : '/api/medicos';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(medicoData) });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      alert(`Médico ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`);
      fetchMedicos();
    } catch (err) {
      alert("Erro ao salvar médico: " + err.message);
    } finally {
      setIsModalOpen(false);
      setMedicoToEdit(null);
    }
  };

  const handleRemoveMedico = async (id) => {
    if (!confirm("Tem certeza?")) return;
    try {
      const response = await fetch(`/api/medicos?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setMedicos(prev => prev.filter(m => m._id !== id));
      alert("Médico removido!");
    } catch (err) {
      alert("Erro ao remover: " + err.message);
    }
  };
  
  return (
    <div className="p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
       <Heading as="h2" text="Gerenciar Médicos" colorClass="dark:text-orangeDark text-orange" className="mb-3" />
       <ParagraphBlue className="mb-6">Adicione, edite ou remova profissionais.</ParagraphBlue>
       <div className="mb-6 text-right">
        <ButtonPrimary onClick={() => { setMedicoToEdit(null); setIsModalOpen(true); }}>
          + Adicionar Médico
        </ButtonPrimary>
      </div>
      {loading ? <p className="text-center py-8">Carregando...</p> : 
       error ? <p className="text-center py-8 text-red-500">{error}</p> : (
        <div className="overflow-x-auto rounded-lg shadow">
           <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
             <thead className="bg-slate-50 dark:bg-slate-700">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium uppercase">Médico</th>
                 <th className="px-6 py-3 text-left text-xs font-medium uppercase">Especialidade</th>
                 <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                 <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
               </tr>
             </thead>
             <tbody className="bg-white dark:bg-white/10 divide-y divide-slate-200 dark:divide-slate-700">
               {medicos.map((med) => (
                 <tr key={med._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                   <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                     <SafeImage src={med.foto} alt={med.nome} width={32} height={32} className="rounded-full object-cover" />
                     <span className="font-medium">{med.nome}</span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm">{med.especialidade}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${med.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                       {med.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <button onClick={() => { setMedicoToEdit(med); setIsModalOpen(true); }} className="text-blue-600 hover:underline mr-4">Editar</button>
                     <button onClick={() => handleRemoveMedico(med._id)} className="text-red-600 hover:underline">Remover</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
       <MedicoFormModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSave={handleSaveMedico}
         medicoToEdit={medicoToEdit}
       />
    </div>
  );
}