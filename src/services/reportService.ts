import { AxiosError } from 'axios';
import { api } from './api';

async function getPdf(path: string): Promise<Blob> {
  try {
    const { data } = await api.get<Blob>(path, { responseType: 'blob' });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data instanceof Blob) {
      try {
        error.response.data = JSON.parse(await error.response.data.text());
      } catch {}
    }
    throw error;
  }
}

class ReportService {
  getEventAttendancePdf(eventId: number | string) {
    return getPdf(`/event/${eventId}/report/attendance.pdf`);
  }

  getActivityAttendancePdf(eventId: number | string, activityId: number | string) {
    return getPdf(`/event/${eventId}/report/activity/${activityId}/attendance.pdf`);
  }

  getMonitorPdf(eventId: number | string) {
    return getPdf(`/event/${eventId}/report/monitors.pdf`);
  }
}

export const reportService = new ReportService();
