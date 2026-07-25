import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Exercicio } from "../types";
import { GrupoMuscularLabel } from "@/shared/enums/GrupoMuscularLabel";

type Props = {
    exercicios: Exercicio[];
    onEdit: (exercicio: Exercicio) => void;
    onDelete: (exercicio: Exercicio) => void;
};

export default function ExercicioTable({
    exercicios,
    onEdit,
    onDelete,
}: Props) {

    const columns: CrudColumn<Exercicio>[] = [
        {
            field: "nome",
            header: "Nome",
        },
        {
            field: "grupoMuscular",
            header: "Grupo Muscular",
            render: (exercicio) =>
                GrupoMuscularLabel[exercicio.grupoMuscular],
        },
        {
            field: "descricao",
            header: "Descrição",
        },
        {
            field: "id",
            header: "Ações",
            align: "center",
            width: 120,
            render: (exercicio) => (
                <CrudActions
                    onEdit={() => onEdit(exercicio)}
                    onDelete={() => onDelete(exercicio)}
                />
            ),
        },
    ];

    return (
        <CrudTable<Exercicio>
            columns={columns}
            rows={exercicios}
            rowKey={(exercicio) => exercicio.id}
        />
    );
}