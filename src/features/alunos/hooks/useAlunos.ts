import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";
import AlunoService from "../services/AlunoService";

export type NotificationState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

export default function useAlunos() {
  const crud = useCrud(AlunoService);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "success",
  });

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  async function create(data: unknown) {
    try {
      await AlunoService.create(data);
      setNotification({
        open: true,
        message: "Aluno cadastrado com sucesso!",
        severity: "success",
      });
      await crud.reload();
    } catch (error) {
      setNotification({
        open: true,
        message: "Erro ao cadastrar aluno. Tente novamente.",
        severity: "error",
      });
      throw error; 
    }
  }

  async function update(id: number, data: unknown) {
    try {
      await AlunoService.update(id, data);
      setNotification({
        open: true,
        message: "Aluno atualizado com sucesso!",
        severity: "success",
      });
      await crud.reload();
    } catch (error) {
      setNotification({
        open: true,
        message: "Erro ao atualizar aluno.",
        severity: "error",
      });
      throw error;
    }
  }

  async function remove(id: number) {
    try {
      await AlunoService.delete(id);
      setNotification({
        open: true,
        message: "Aluno removido com sucesso!",
        severity: "success",
      });
      await crud.reload();
    } catch (error) {
      setNotification({
        open: true,
        message: "Erro ao remover aluno.",
        severity: "error",
      });
    }
  }

  return {
    ...crud,
    create,
    update,
    remove,
    notification,
    closeNotification,
  };
}