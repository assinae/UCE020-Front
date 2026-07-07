import type { PresenceScanStatus } from '@/types/presence';

export function getScanStatusMessage(
  status: PresenceScanStatus,
  payload: { participantName: string; activityTitle: string } | null,
): { message: string; monitorGuidance: string } {
  switch (status) {
    case 'ready':
      return {
        message: `Confirmar presença de ${payload?.participantName} em ${payload?.activityTitle}`,
        monitorGuidance: 'Confirme a presença se os dados estiverem corretos',
      };
    case 'invalid_qr':
      return {
        message: 'QR Code inválido ou não gerado pelo sistema',
        monitorGuidance:
          'Oriente o participante a acessar o evento, selecionar a atividade em andamento e tocar em "Marcar Presença" para gerar um novo QR Code',
      };
    case 'wrong_event':
      return {
        message: 'Este QR Code corresponde a outro evento',
        monitorGuidance:
          'Oriente o participante a acessar o evento correto e selecionar a atividade em andamento para gerar um novo QR Code',
      };
    case 'wrong_activity':
      return {
        message: payload
          ? `Este QR Code corresponde à atividade "${payload.activityTitle}"`
          : 'Este QR Code corresponde a outra atividade',
        monitorGuidance:
          'Oriente o participante a acessar o evento e selecionar a atividade correta para gerar um novo QR Code',
      };
    case 'participant_not_found':
      return {
        message: payload
          ? `Participante "${payload.participantName}" não encontrado`
          : 'Participante não encontrado',
        monitorGuidance:
          'Verifique se o participante está cadastrado no evento. Se necessário, oriente-o a inscrever-se no evento e na atividade em andamento',
      };
    case 'not_registered':
      return {
        message: payload
          ? `${payload.participantName} não está inscrito em "${payload.activityTitle}"`
          : 'Participante não inscrito nesta atividade',
        monitorGuidance:
          'Oriente o participante a inscrever-se na atividade em andamento para marcar presença',
      };
    case 'already_confirmed':
      return {
        message: payload
          ? `A presença de ${payload.participantName} em "${payload.activityTitle}" já foi confirmada`
          : 'Presença já confirmada',
        monitorGuidance: 'Nenhuma ação necessária',
      };
    default:
      return {
        message: 'Não foi possível validar este QR Code',
        monitorGuidance: 'Tente novamente ou oriente o participante a gerar um novo QR Code',
      };
  }
}
