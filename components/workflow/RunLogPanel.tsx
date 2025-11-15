"use client";

import { useWorkflowStore } from "@/store/workflowStore";
import Badge from "@/components/ui/Badge";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

export default function RunLogPanel() {
  const { runLogs, isRunning } = useWorkflowStore();

  if (!isRunning && runLogs.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="success">Başarılı</Badge>;
      case "error":
        return <Badge variant="error">Hata</Badge>;
      case "running":
        return <Badge variant="info">Çalışıyor</Badge>;
      default:
        return <Badge>Bekliyor</Badge>;
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getDuration = (start: string, end?: string) => {
    if (!end) return "-";
    const duration = new Date(end).getTime() - new Date(start).getTime();
    return `${duration}ms`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 bg-dark-900 border-t border-dark-800 flex flex-col">
      <div className="p-4 border-b border-dark-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Run Logs</h3>
          {isRunning && (
            <Badge variant="info" className="gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Çalışıyor...
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {runLogs.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            Henüz log yok
          </div>
        ) : (
          runLogs.map((log, index) => (
            <div
              key={index}
              className="bg-dark-800 rounded-lg p-3 border border-dark-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(log.status)}
                  <span className="text-sm font-medium text-foreground">
                    {log.nodeName}
                  </span>
                </div>
                {getStatusBadge(log.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div>
                  <span className="font-medium">Başlangıç:</span>{" "}
                  {formatTime(log.startTime)}
                </div>
                {log.endTime && (
                  <div>
                    <span className="font-medium">Bitiş:</span>{" "}
                    {formatTime(log.endTime)}
                  </div>
                )}
                <div>
                  <span className="font-medium">Süre:</span>{" "}
                  {getDuration(log.startTime, log.endTime)}
                </div>
              </div>

              {log.payload && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Payload'ı göster
                  </summary>
                  <pre className="mt-2 p-2 bg-dark-950 rounded text-xs text-foreground overflow-x-auto">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </details>
              )}

              {log.error && (
                <div className="mt-2 p-2 bg-red-600/10 border border-red-600/30 rounded text-xs text-red-400">
                  <span className="font-medium">Hata:</span> {log.error}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

