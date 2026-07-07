export function getConfirmPresenceMessage(participantName: string, activityTitle: string) {
  return {
    message: 'Deseja confirmar a presença de',
    emphasisEndText: `${participantName} na atividade ${activityTitle}?`,
  };
}

export function getRemovePresenceMessage(participantName: string, activityTitle: string) {
  return {
    message: 'Deseja remover a presença de',
    emphasisEndText: `${participantName} na atividade ${activityTitle}?`,
  };
}

export function getRemoveStaffMessage(personName: string, contextLabel: string) {
  return {
    message: `Deseja remover ${contextLabel}`,
    emphasisEndText: `${personName}?`,
  };
}
