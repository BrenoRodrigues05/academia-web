import MainLayout from "@/layouts/MainLayout";

import {

AppPageHeader,

AppPagination,

AppSearch,

AppLoading,

} from "@/components/ui";

import AlunoTable from "../components/AlunoTable";

import useAlunos from "../hooks/useAlunos";

export default function AlunosPage() {

const {

data,

loading,

page,

setPage,

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

<br />

{loading && <AppLoading />}

{!loading && data && (

<>

<AlunoTable

alunos={data.content}

/>

<AppPagination

page={page}

totalPages={data.totalPages}

totalElements={data.totalElements}

onChange={setPage}

/>

</>

)}

</MainLayout>

);

}