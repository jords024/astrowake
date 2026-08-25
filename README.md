# Lumina Flow

npm install gsap @studio-freight/lenis lucide-react
'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Calendar, Clock, Lock } from 'lucide-react';

export default function LandingPageCaptura() {
  const parallaxRef = useRef(null);
  const [formData, setFormData] = useState({ nome: '', email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      });

      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="1"]'),
        { yPercent: 40, ease: 'none' },
        0
      );
      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="2"]'),
        { yPercent: 20, ease: 'none' },
        0
      );
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulação de envio para a Thank You Page
    setTimeout(() => {
      window.location.href = '/obrigado';
    }, 1200);
  };

  return (
    


      
      {/ ========================================================================= /}
      {/ SEÇÃO 1: HERO & FORMULÁRIO DE CAPTAÇÃO DE ALTA CONVERSÃO                  /}
      {/ ========================================================================= /}
      


        
        {/ PARALLAX VISUAL BACKGROUND /}
        


          {/ Layer 1: Avatar IA de Crassus com Efeitos Cósmicos /}
          


            
            


            


          



          {/ Layer 2: Efeitos Cósmicos & Partículas /}
          


        



        {/ CONTENT CONTAINER (FAR-LEFT ALIGNED DESIGN) /}
        


          
          {/ LADO ESQUERDO: COPY DE ALTA INTENSIDADE E PROMESSA 1D /}
          


            
            {/ BADGE EVENTO /}
            


              
              
                EVENTO AO VIVO E 100% GRATUITO • QUINTA-FEIRA ÀS 20H
              
            



            {/ HEADLINE PRINCIPAL (PROMESSA 1D) /}
            


              Aprenda a fazer a sua{' '}
              
                limpeza energética
              {' '}
              e alinhar o seu campo para se proteger no dia a dia.
            



            {/ SUBHEADLINE POPULAR /}
            


              O passo a passo prático para destravar o seu dinheiro, trazer paz para o seu relacionamento e ter uma vida leve e fluida — sem misticismo raso e sem decoreba.
            



            {/ BARRA DE DATA E HORÁRIO /}
            


              


                
                Nesta Quinta-Feira
              


              


                
                Às 20h00 (Horário de Brasília)
              


            



            {/ CHECKLIST DE BENEFÍCIOS /}
            


              {[
                'Desative a exaustão física e a queimação na nuca após dias difíceis.',
                'Elimine os ruídos e vazamentos que travam a sua vida financeira.',
                'Resgate a sua presença e o carinho dentro da sua casa sem brigas.',
              ].map((item, idx) => (
                


                  
                  {item}
                


              ))}
            



          



          {/ LADO DIREITO: FORMULÁRIO DE CAPTAÇÃO (GLASSMORPHISM) /}
          


            


              
              {/ Efeito de brilho no topo do card /}
              



              


                

Garanta Sua Vaga Gratuita


                

Preencha os dados abaixo para receber o link VIP da sala ao vivo:


              



              


                


                  Seu Nome Completo
                   setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                  />
                



                


                  Seu Melhor E-mail
                   setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                  />
                



                


                  Seu WhatsApp com DDD
                   setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                  />
                



                
                  {isSubmitting ? (
                    GARANTINDO VAGA...
                  ) : (
                    <>
                      QUERO GARANTIR MINHA VAGA
                      
                    
                  )}
                

                


                  
                  Seus dados estão 100% seguros. Livre de Spam.
                


              



            


          



        


      



      {/ ========================================================================= /}
      {/ SEÇÃO 2: QUEM É CRASSUS GOBBI (HISTÓRIA DE AUTORIDADE & POSICIONAMENTO)    /}
      {/ ========================================================================= /}
      


        


          


            
            {/ FOTO DO CRASSUS COM POSICIONAMENTO DE AUTORIDADE /}
            


              


                
                


                


                  

Crassus Gobbi


                  

Criador do Método Astrowake • +5.000 Atendimentos


                


              


            



            {/ TEXTO DE HISTÓRIA E NARRATIVA DE MARCA /}
            


              


                
                QUEM VAI TE GUIAR
              



              


                De empresário de blazer a 40°C ao criador de uma metodologia sem misticismo raso.
              



              


                


                  Aos 28 anos, eu era dono de 5 empresas, usava blazer no calor de 40 graus em Porto Alegre e achava que sucesso era passar 14 horas por dia trabalhando no escuro pra tentar provar valor pros outros.
                


                


                  Eu vivia no modo difícil: exausto, com a vida financeira travada em imprevistos e sentindo que tava vestindo uma armadura pesada que não era minha.
                


                


                  Foi quando eu resgatei o conhecimento de mais de 45 anos da minha família e decidi aplicar a astrologia de forma prática, direta e pé no chão. 
                


                


                  Hoje, com mais de 5.000 atendimentos individuais realizados no consultório, o meu trabalho é te entregar o manual de instruções da sua alma pra você parar de dar murro em ponta de faca e viver com total clareza e autonomia.
                


              



              


                


                  

+5.000


                  

Atendimentos Reais


                


                


                  

100%


                  

Sem Decoreba


                


                


                  

10 Anos


                  

De Prática de Campo


                


              



            



          


        


      



    


  );
}

Use essa imagem acima de background do hero, o estilo deve ser com cores pretas e amarelas, tons luxuosos e minimalistas

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://astrowake.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b26bc652-be79-46f9-8e21-7a7ecf8492c5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
