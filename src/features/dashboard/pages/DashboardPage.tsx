import MainLayout from "@/layouts/MainLayout";

import {

AppPageHeader,

} from "@/components/ui";

import DashboardStats from "../components/DashboardStats";

export default function DashboardPage() {

return (

<MainLayout>

<AppPageHeader

title="Gerenciamento da Academia"

subtitle="Visão geral da Academia"

/>

<DashboardStats />

</MainLayout>

);

}