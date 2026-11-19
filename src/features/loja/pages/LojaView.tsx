import { useState, useEffect, type FormEvent, type MouseEvent } from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Grid,
    Paper,
    Divider,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Menu,
    TextField,
    InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
import { AppLoading, AppPagination } from "@/components/ui";

import useProdutos from "../hooks/useProdutos";
import pedidoService from "../api/PedidoService";
import type { Produto, ItemCarrinho, MetodoPagamentoLoja, PedidoResponse } from "../types";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LojaView() {
    const { user } = useAuth();
    const isAdminOrSuperAdmin = Boolean(
        user?.role && ["SUPER_ADMIN", "ADMIN"].includes(user.role)
    );

    const { data: produtosData, loading, page, setPage } = useProdutos();
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [metodoPagamento] = useState<MetodoPagamentoLoja>("PAGAR_NA_RETIRADA");
    const [submitting, setSubmitting] = useState(false);

    const [currentTab, setCurrentTab] = useState<number>(0); 
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [loadingPedidos, setLoadingPedidos] = useState<boolean>(false);
    const [erroPedidos, setErroPedidos] = useState<string | null>(null);

    const [nomeAlunoBusca, setNomeAlunoBusca] = useState("");
    const [ultimoNomeBuscado, setUltimoNomeBuscado] = useState<string | null>(null);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoResponse | null>(null);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "info" | "warning",
    });

    const produtos: Produto[] = Array.isArray(produtosData)
        ? produtosData
        : Array.isArray(produtosData?.content)
        ? produtosData.content
        : [];

    const carregarMeusPedidos = async () => {
        setLoadingPedidos(true);
        setErroPedidos(null);
        try {
            const data = await pedidoService.listarMeusPedidos();
            setPedidos(Array.isArray(data) ? data : []);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Erro ao carregar seus pedidos.";
            setErroPedidos(msg);
            setPedidos([]);
            setNotification({ open: true, message: msg, severity: "error" });
        } finally {
            setLoadingPedidos(false);
        }
    };

    const buscarPedidosPorAluno = async (termo: string, silencioso = false) => {
        const valorLimpo = termo.trim();
        if (!valorLimpo) {
            if (!silencioso) {
                setNotification({
                    open: true,
                    message: "Digite o nome do aluno para buscar os pedidos.",
                    severity: "warning",
                });
            }
            return;
        }

        setLoadingPedidos(true);
        setErroPedidos(null);
        setUltimoNomeBuscado(valorLimpo);

        try {
            const data = await pedidoService.BuscarPedidoDoAluno(valorLimpo);
            setPedidos(Array.isArray(data) ? data : []);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Erro ao buscar pedidos do aluno.";
            setErroPedidos(msg);
            setPedidos([]);
            if (!silencioso) {
                setNotification({ open: true, message: msg, severity: "error" });
            }
        } finally {
            setLoadingPedidos(false);
        }
    };

    useEffect(() => {
        if (currentTab === 1 && !isAdminOrSuperAdmin) {
            carregarMeusPedidos();
        }
    }, [currentTab, isAdminOrSuperAdmin]);

    const handleBuscarAlunoSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await buscarPedidosPorAluno(nomeAlunoBusca);
    };

    const handleLimparBuscaAluno = () => {
        setNomeAlunoBusca("");
        setUltimoNomeBuscado(null);
        setPedidos([]);
        setErroPedidos(null);
    };

    const adicionarAoCarrinho = (produto: Produto) => {
        setCarrinho((prev) => {
            const index = prev.findIndex((item) => item.produto.id === produto.id);
            if (index >= 0) {
                const itemAtual = prev[index];
                if (itemAtual.quantidade >= produto.estoque) {
                    setNotification({
                        open: true,
                        message: "Estoque máximo atingido para este produto.",
                        severity: "warning",
                    });
                    return prev;
                }
                const novoCarrinho = [...prev];
                novoCarrinho[index] = { ...itemAtual, quantidade: itemAtual.quantidade + 1 };
                return novoCarrinho;
            }
            return [...prev, { produto, quantidade: 1 }];
        });
    };

    const alterarQuantidade = (produtoId: number, delta: number) => {
        setCarrinho((prev) =>
            prev
                .map((item) => {
                    if (item.produto.id === produtoId) {
                        const novaQtd = item.quantidade + delta;
                        if (novaQtd > item.produto.estoque) return item;
                        return { ...item, quantidade: novaQtd };
                    }
                    return item;
                })
                .filter((item) => item.quantidade > 0)
        );
    };

    const removerItem = (produtoId: number) => {
        setCarrinho((prev) => prev.filter((item) => item.produto.id !== produtoId));
    };

    const calcularTotal = () => {
        return carrinho.reduce((acc, item) => acc + Number(item.produto.preco) * item.quantidade, 0);
    };

    const handleIniciarCheckout = () => {
        if (carrinho.length === 0) return;
        setConfirmDialogOpen(true);
    };

    const confirmarEFinalizarPedido = async () => {
        setConfirmDialogOpen(false);
        setSubmitting(true);
        try {
            const payload = {
                itens: carrinho.map((item) => ({
                    produtoId: item.produto.id,
                    quantidade: item.quantidade,
                })),
                metodoPagamento: metodoPagamento as "PAGAR_NA_RETIRADA",
            };

            const response = await pedidoService.criarPedido(payload);
            setCarrinho([]);

            setNotification({
                open: true,
                message: `Pedido #${response.id} realizado com sucesso!`,
                severity: "success",
            });

            if (!isAdminOrSuperAdmin) {
                carregarMeusPedidos();
            } else if (ultimoNomeBuscado) {
                await buscarPedidosPorAluno(ultimoNomeBuscado, true);
            }
        } catch (error: any) {
            setNotification({
                open: true,
                message: error.response?.data?.message || "Erro ao finalizar pedido.",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenStatusMenu = (event: MouseEvent<HTMLElement>, pedido: PedidoResponse) => {
        setAnchorEl(event.currentTarget);
        setPedidoSelecionado(pedido);
    };

    const handleCloseStatusMenu = () => {
        setAnchorEl(null);
        setPedidoSelecionado(null);
    };

    const alterarStatusAdmin = async (novoStatus: string) => {
        if (!pedidoSelecionado) return;
        const pedidoId = pedidoSelecionado.id;
        handleCloseStatusMenu();
        setSubmitting(true);
        try {
            await pedidoService.atualizarStatusPedido(pedidoId, novoStatus);
            setNotification({
                open: true,
                message: `Status do pedido #${pedidoId} atualizado para ${novoStatus}!`,
                severity: "success",
            });
            if (ultimoNomeBuscado) {
                await buscarPedidosPorAluno(ultimoNomeBuscado, true);
            }
        } catch (error: any) {
            setNotification({
                open: true,
                message: error?.response?.data?.message || "Erro ao atualizar status do pedido.",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formatarData = (pedido: any) => {
        const rawDate = pedido.createdAt || pedido.dataCriacao;
        if (!rawDate) return "-";
        const parsed = new Date(rawDate);
        if (Number.isNaN(parsed.getTime())) return "-";
        return parsed.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    };

    const formatarPagamento = (metodo?: string) => {
        if (!metodo) return "-";
        return metodo === "PAGAR_NA_RETIRADA" ? "Pagar na Retirada" : "Pix";
    };

    const renderTabelaPedidos = () => {
        if (loadingPedidos) {
            return <AppLoading />;
        }

        if (erroPedidos) {
            return (
                <ErrorState
                    message={erroPedidos}
                    onRetry={() =>
                        isAdminOrSuperAdmin
                            ? buscarPedidosPorAluno(ultimoNomeBuscado || nomeAlunoBusca)
                            : carregarMeusPedidos()
                    }
                />
            );
        }

        if (isAdminOrSuperAdmin && ultimoNomeBuscado === null) {
            return (
                <EmptyState message="Digite o nome do aluno acima para consultar e gerenciar os pedidos." />
            );
        }

        if (pedidos.length === 0) {
            return (
                <EmptyState
                    message={
                        isAdminOrSuperAdmin
                            ? `Nenhum pedido encontrado para "${ultimoNomeBuscado}".`
                            : "Você ainda não realizou nenhum pedido."
                    }
                />
            );
        }

        return (
            <TableContainer component={Paper} elevation={1} sx={{ overflowX: "auto" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            {isAdminOrSuperAdmin && <TableCell><strong>Aluno</strong></TableCell>}
                            <TableCell><strong>Data</strong></TableCell>
                            <TableCell><strong>Pagamento</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Valor Total</strong></TableCell>
                            {isAdminOrSuperAdmin && (
                                <TableCell align="center"><strong>Ações</strong></TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidos.map((pedido: any) => (
                            <TableRow key={pedido.id} hover>
                                <TableCell>#{pedido.id}</TableCell>
                                {isAdminOrSuperAdmin && (
                                    <TableCell>
                                        {pedido.alunoNome || pedido.usuarioNome || ultimoNomeBuscado}
                                    </TableCell>
                                )}
                                <TableCell>{formatarData(pedido)}</TableCell>
                                <TableCell>{formatarPagamento(pedido.metodoPagamento)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={pedido.status || "-"}
                                        color={
                                            String(pedido.status).includes("RESERVADO") ||
                                            String(pedido.status).includes("PENDENTE")
                                                ? "warning"
                                                : String(pedido.status).includes("CANCELADO")
                                                ? "error"
                                                : "success"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                    R$ {Number(pedido.valorTotal ?? 0).toFixed(2)}
                                </TableCell>
                                {isAdminOrSuperAdmin && (
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            aria-label="alterar status"
                                            onClick={(e) => handleOpenStatusMenu(e, pedido)}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    if (loading) {
        return <AppLoading />;
    }

    return (
        <>
            <LoadingOverlay open={submitting} />

            <CrudPage
                toolbar={
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Box
                            sx={{
                                flexGrow: 1,
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >
                            <CrudToolbar
                                title={isAdminOrSuperAdmin ? "Gerenciamento de Pedidos & Loja" : "Loja da Academia"}
                                subtitle={
                                    isAdminOrSuperAdmin
                                        ? "Busque pedidos por aluno, dê baixa e altere status"
                                        : "Compre suplementos, acessórios e itens oficiais"
                                }
                            />
                            <Tabs
                                value={currentTab}
                                onChange={(_, val) => setCurrentTab(val)}
                                aria-label="abas da loja"
                            >
                                <Tab icon={<StorefrontIcon />} iconPosition="start" label="Vitrine" />
                                <Tab
                                    icon={<ListAltIcon />}
                                    iconPosition="start"
                                    label={isAdminOrSuperAdmin ? "Gerenciar Pedidos" : "Meus Pedidos"}
                                />
                            </Tabs>
                        </Box>

                        {currentTab === 1 && isAdminOrSuperAdmin && (
                            <Box
                                component="form"
                                onSubmit={handleBuscarAlunoSubmit}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 2,
                                    width: "100%",
                                    mt: -1,
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    size="small"
                                    label="Nome do aluno"
                                    placeholder="Digite o nome do aluno..."
                                    variant="outlined"
                                    value={nomeAlunoBusca}
                                    onChange={(e) => setNomeAlunoBusca(e.target.value)}
                                    sx={{
                                        minWidth: 220,
                                        flex: { xs: "1 1 100%", sm: "1 1 260px" },
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    disabled={loadingPedidos}
                                    sx={{ width: { xs: "100%", sm: "auto" } }}
                                >
                                    Buscar
                                </Button>

                                {(nomeAlunoBusca || ultimoNomeBuscado) && (
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<ClearIcon />}
                                        disabled={loadingPedidos}
                                        onClick={handleLimparBuscaAluno}
                                        sx={{ width: { xs: "100%", sm: "auto" } }}
                                    >
                                        Limpar
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                }
                table={
                    currentTab === 0 ? (
                        <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                            <Box sx={{ flex: 1 }}>
                                <Grid container spacing={2}>
                                    {produtos.map((produto) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={produto.id}>
                                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={produto.imagemUrl || "https://via.placeholder.com/150"}
                                                    alt={produto.nome}
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography gutterBottom variant="h6" component="div">
                                                        {produto.nome}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {produto.descricao || "Sem descrição"}
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold" }}>
                                                        R$ {Number(produto.preco).toFixed(2)}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color={produto.estoque === 0 ? "error" : "text.secondary"}
                                                    >
                                                        Estoque: {produto.estoque} un.
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<ShoppingCartIcon />}
                                                        disabled={produto.estoque === 0}
                                                        onClick={() => adicionarAoCarrinho(produto)}
                                                    >
                                                        {produto.estoque === 0 ? "Esgotado" : "Adicionar"}
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            <Paper elevation={2} sx={{ width: { xs: "100%", md: "380px" }, p: 2.5, height: "fit-content" }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                    Seu Carrinho
                                </Typography>

                                {carrinho.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        O carrinho está vazio.
                                    </Typography>
                                ) : (
                                    <>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                                mb: 2,
                                                maxHeight: "250px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {carrinho.map((item) => (
                                                <Box
                                                    key={item.produto.id}
                                                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                                >
                                                    <Box sx={{ maxWidth: "160px" }}>
                                                        <Typography variant="body2" sx={{ fontWeight: "bold" }} noWrap>
                                                            {item.produto.nome}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            R$ {Number(item.produto.preco).toFixed(2)} un.
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => alterarQuantidade(item.produto.id, -1)}
                                                        >
                                                            <RemoveIcon fontSize="small" />
                                                        </IconButton>
                                                        <Typography variant="body2">{item.quantidade}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => alterarQuantidade(item.produto.id, 1)}
                                                        >
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => removerItem(item.produto.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ mb: 2 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Forma de Pagamento</InputLabel>
                                                <Select value={metodoPagamento} label="Forma de Pagamento" disabled>
                                                    <MenuItem value="PAGAR_NA_RETIRADA">Pagar na Retirada</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                Total:
                                            </Typography>
                                            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold" }}>
                                                R$ {calcularTotal().toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="success"
                                            disabled={submitting}
                                            onClick={handleIniciarCheckout}
                                        >
                                            Finalizar Pedido
                                        </Button>
                                    </>
                                )}
                            </Paper>
                        </Box>
                    ) : (
                        <Box>
                            {renderTabelaPedidos()}

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseStatusMenu}
                            >
                                <MenuItem onClick={() => alterarStatusAdmin("CONCLUIDO")}>
                                    Dar Baixa / Concluir
                                </MenuItem>
                                <MenuItem onClick={() => alterarStatusAdmin("CANCELADO")}>
                                    Cancelar Pedido
                                </MenuItem>
                                <MenuItem onClick={() => alterarStatusAdmin("PENDENTE_PAGAMENTO")}>
                                    Marcar Pendente
                                </MenuItem>
                            </Menu>
                        </Box>
                    )
                }
                pagination={
                    currentTab === 0 && !loading && produtosData && "totalPages" in produtosData ? (
                        <AppPagination
                            page={page}
                            totalPages={(produtosData as any).totalPages}
                            totalElements={(produtosData as any).totalElements}
                            onChange={setPage}
                        />
                    ) : undefined
                }
            />

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold" }}>Confirmar Pedido</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Deseja confirmar a realização deste pedido no valor total de{" "}
                        <strong>R$ {calcularTotal().toFixed(2)}</strong>?
                    </Typography>

                    <Alert severity="info" sx={{ fontSize: "0.85rem" }}>
                        O pedido ficará reservado e disponível para retirada por <strong>24 horas</strong> a partir de agora
                        na recepção da academia.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={confirmarEFinalizarPedido} variant="contained" color="success">
                        Confirmar Pedido
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
}