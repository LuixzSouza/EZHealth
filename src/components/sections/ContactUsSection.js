'use client';

import { useState } from "react";
import Image from "next/image";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";

export function ContactUsSection() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        mensagem: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório.";
        if (!formData.email.trim()) {
            newErrors.email = "E-mail é obrigatório.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "E-mail inválido.";
        }
        if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório.";
        if (!formData.mensagem.trim()) newErrors.mensagem = "Mensagem é obrigatória.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Formulário enviado:", formData);
            setSubmitted(true);
            setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
            setErrors({});
        }
    };

    return (
        <section className="flex flex-col items-center justify-between pt-14 lg:flex-row lg:items-end" id="scontato">
            <ContainerGrid className="flex flex-col items-start justify-end gap-5">
                <HeadingOrange text="FALE CONOSCO!" />
                <ParagraphBlue>
                    Tem dúvidas? Entre em contato e descubra como o EZHealth pode transformar seu atendimento!
                </ParagraphBlue>
                <div className="flex items-center justify-center gap-5">
                    <Image src={"/icons/whatsapp.svg"} alt="Icon Zap" width={45} height={45} />
                    <span className="text-DarkBlue text-3xl font-semibold">+55 (35) 98569-2364</span>
                </div>
            </ContainerGrid>

            <form onSubmit={handleSubmit} className="w-full max-w-screen-sm flex flex-col items-start justify-start gap-6 bg-orange p-10 rounded-md mt-14 z-10 lg:mb-0">
                <div className="w-full">
                    <label className="text-white">Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border-2 border-white"
                    />
                    {errors.nome && <p className="text-white text-sm mt-1">{errors.nome}</p>}
                </div>

                <div className="w-full">
                    <label className="text-white">E-mail:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border-2 border-white"
                    />
                    {errors.email && <p className="text-white text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="w-full">
                    <label className="text-white">Telefone:</label>
                    <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border-2 border-white"
                    />
                    {errors.telefone && <p className="text-white text-sm mt-1">{errors.telefone}</p>}
                </div>

                <div className="w-full">
                    <label className="text-white">Mensagem:</label>
                    <textarea
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        rows={5}
                        className="w-full p-2 rounded-md border-2 border-white resize-none"
                    />
                    {errors.mensagem && <p className="text-white text-sm mt-1">{errors.mensagem}</p>}
                </div>

                <button
                    type="submit"
                    className="text-white text-2xl border-2 border-white rounded-full px-8 py-3 hover:bg-white hover:text-orange transition"
                >
                    Enviar
                </button>

                {submitted && (
                    <p className="text-white text-lg mt-2">Mensagem enviada com sucesso!</p>
                )}
            </form>
        </section>
    );
}
