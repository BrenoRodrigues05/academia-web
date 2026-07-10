import MainLayout from "@/layouts/MainLayout";

import {

AppPageHeader,

AppSearch,

} from "@/components/ui";

import useAlunos from "../hooks/useAlunos";

export default function AlunosPage() {

const {

data,

} = useAlunos();

return (

<MainLayout>

<AppPageHeader

title="Alunos"

subtitle="Gerenciamento de alunos"

/>

<AppSearch

placeholder="Pesquisar alunos"

onSearch={(value) => {

console.log(value);

}}

/>

</MainLayout>

);

}