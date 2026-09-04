import type { ComponentType } from 'react';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';

export type TutorialRole = 'organizer' | 'participant';

export interface TutorialStep {
  icon: ComponentType<{ sx?: object }>;
  title: string;
  description: string;
  /**
   * Path under /public where the screenshot for this step should live
   * (e.g. "/images/tutorial/step-login.png"). Until that file exists, the
   * modal shows a labeled placeholder frame in its place — drop the image
   * in with this exact name and it appears automatically, no code change
   * needed.
   */
  image: string;
  /** Short label shown inside the placeholder describing which screen to capture. */
  imageHint: string;
}

export interface TutorialRoleContent {
  role: TutorialRole;
  label: string;
  pitch: string;
  icon: ComponentType<{ sx?: object }>;
  accent: string;
  accentBg: string;
  accentBorder: string;
  steps: TutorialStep[];
  ctaLabel: string;
  ctaHref: string;
}

export const tutorialContent: Record<TutorialRole, TutorialRoleContent> = {
  organizer: {
    role: 'organizer',
    label: 'Organizador do evento',
    pitch: 'Você vai criar um novo evento e acompanhar tudo, do cadastro à emissão dos certificados.',
    icon: EventAvailableRoundedIcon,
    accent: '#059669',
    accentBg: '#E8FFF6',
    accentBorder: 'rgba(5,150,105,0.25)',
    ctaLabel: 'Criar minha conta e começar',
    ctaHref: '/register',
    steps: [
      {
        icon: PersonAddAlt1RoundedIcon,
        title: 'Crie sua conta',
        description:
          'Cadastre-se gratuitamente na plataforma e faça login para acessar o seu painel de organizador.',
        image: '/images/tutorial/step-login.png',
        imageHint: 'Tela de login / criar conta',
      },
      {
        icon: EventAvailableRoundedIcon,
        title: 'Cadastre o evento',
        description:
          'Clique em "Novo Evento" e preencha nome, data, carga horária e demais informações gerais.',
        image: '/images/tutorial/organizer-novo-evento.png',
        imageHint: 'Formulário de cadastro de novo evento',
      },
      {
        icon: PlaylistAddCheckRoundedIcon,
        title: 'Adicione as atividades',
        description:
          'Cadastre as atividades do evento — palestras, oficinas, minicursos — com data, horário e carga horária de cada uma.',
        image: '/images/tutorial/organizer-atividades.png',
        imageHint: 'Formulário de cadastro de atividade',
      },
      {
        icon: GroupsRoundedIcon,
        title: 'Gerencie participantes e monitores',
        description:
          'Defina quem são os monitores responsáveis por validar a presença e acompanhe as inscrições recebidas.',
        image: '/images/tutorial/organizer-gerenciar-usuarios.png',
        imageHint: 'Tela "Gerenciar Usuários" do evento',
      },
      {
        icon: QrCode2RoundedIcon,
        title: 'Valide presenças em tempo real',
        description:
          'No dia do evento, o monitor escaneia o QR Code pessoal de cada participante para confirmar o check-in na atividade.',
        image: '/images/tutorial/organizer-validar-presenca.png',
        imageHint: 'Tela do leitor de QR Code de validação de presença',
      },
      {
        icon: WorkspacePremiumRoundedIcon,
        title: 'Finalize e emita certificados',
        description:
          'Ao encerrar o evento, clique em "Finalizar Evento": os certificados são gerados automaticamente para quem cumpriu a carga horária mínima.',
        image: '/images/tutorial/organizer-certificados.png',
        imageHint: 'Tela de certificados gerados do evento',
      },
    ],
  },
  participant: {
    role: 'participant',
    label: 'Participante do evento',
    pitch: 'Você vai se inscrever em um evento e validar sua presença para receber o certificado.',
    icon: HowToRegRoundedIcon,
    accent: '#0EA5E9',
    accentBg: '#EFF8FF',
    accentBorder: 'rgba(14,165,233,0.25)',
    ctaLabel: 'Criar minha conta e me inscrever',
    ctaHref: '/register',
    steps: [
      {
        icon: PersonAddAlt1RoundedIcon,
        title: 'Crie sua conta',
        description:
          'Cadastre-se gratuitamente na plataforma e faça login para acessar os eventos disponíveis.',
        image: '/images/tutorial/step-login.png',
        imageHint: 'Tela de login / criar conta',
      },
      {
        icon: SearchRoundedIcon,
        title: 'Encontre o evento e inscreva-se',
        description:
          'Busque o evento que deseja participar e clique em "Inscrever-se no evento" para garantir sua vaga.',
        image: '/images/tutorial/participant-inscricao.png',
        imageHint: 'Página do evento com o botão "Inscrever-se no evento"',
      },
      {
        icon: QrCode2RoundedIcon,
        title: 'Mostre seu QR Code pessoal',
        description:
          'No dia da atividade, gere seu QR Code de presença e mostre para o monitor confirmar o seu check-in.',
        image: '/images/tutorial/participant-qrcode.png',
        imageHint: 'Modal do QR Code pessoal de presença',
      },
      {
        icon: HowToRegRoundedIcon,
        title: 'Acompanhe sua presença',
        description:
          'Confira na lista de participantes se sua presença já foi confirmada, identificada pelo ícone de check.',
        image: '/images/tutorial/participant-lista-presenca.png',
        imageHint: 'Lista de participantes com status de presença',
      },
      {
        icon: WorkspacePremiumRoundedIcon,
        title: 'Receba seu certificado',
        description:
          'Ao final do evento, seu certificado é emitido automaticamente se você atingiu a carga horária mínima exigida.',
        image: '/images/tutorial/participant-certificado.png',
        imageHint: 'Certificado emitido para o participante',
      },
    ],
  },
};
