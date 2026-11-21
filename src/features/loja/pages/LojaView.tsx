import { useState, useEffect, type FormEvent, type MouseEvent } from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
    alpha,
    } from "@mui/material";
    import {
    Add,
    BlockOutlined,
    CheckCircleOutlined,
    Clear,
    DeleteOutlined,
    HourglassEmpty,
    Inventory2Outlined,
    ListAltOutlined,
    MoreVert,
    Remove,
    Search,
    ShoppingBagOutlined,
    ShoppingCartOutlined,
    StorefrontOutlined,
    } from "@mui/icons-material";

    import CrudPage from "@/components/crud/CrudPage";
    import CrudToolbar from "@/components/crud/CrudToolbar";
    import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
    import ConfirmDialog from "@/components/feedback/ConfirmDialog";
    import AppSnackbar from "@/components/feedback/AppSnackbar";
    import { AppLoading, AppPagination } from "@/components/ui";
    import { AppSelectField } from "@/components/forms";

    import useProdutos from "../hooks/useProdutos";
    import pedidoService from "../api/PedidoService";
    import type { Produto, ItemCarrinho, MetodoPagamentoLoja, PedidoResponse } from "../types";
    import { useAuth } from "@/features/auth/hooks/useAuth";

    const formatMoney = (valor: number | string) =>
    Number(valor ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const statusColor = (status?: string): "warning" | "error" | "success" => {
    const s = String(status);
    if (s.includes("RESERVADO") || s.includes("PENDENTE")) return "warning";
    if (s.includes("CANCELADO")) return "error";
    return "success";
    };

    const headCellSx = {
    fontWeight: 800,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "text.secondary",
    borderBottomColor: "divider",
    } as const;

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

    const calcularTotal = () =>
        carrinho.reduce((acc, item) => acc + Number(item.produto.preco) * item.quantidade, 0);

    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

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
        return metodo === "PAGAR_NA_RETIRADA" ? "Pagar na retirada" : "Pix";
    };


    const renderVitrine = () => {
        if (loading) return <AppLoading />;

        if (produtos.length === 0) {
        return <EmptyState message="Nenhum produto disponível no momento." />;
        }

        return (
        <Box
            sx={{
            display: "flex",
            gap: 3,
            flexWrap: { xs: "wrap", lg: "nowrap" },
            alignItems: "flex-start",
            }}
        >
            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <Grid container spacing={2.5}>
                {produtos.map((produto) => {
                const esgotado = produto.estoque === 0;

                return (
                    <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={produto.id}>
                    <Card
                        variant="outlined"
                        sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "all .2s",
                        "&:hover": {
                            borderColor: (t) => alpha(t.palette.primary.main, 0.5),
                            transform: "translateY(-3px)",
                            boxShadow: (t) => `0 12px 32px ${alpha(t.palette.primary.main, 0.1)}`,
                        },
                        }}
                    >
                        <Box sx={{ position: "relative", height: 170, bgcolor: "action.hover" }}>
                        {produto.imagemUrl ? (
                            <CardMedia
                            component="img"
                            image={produto.imagemUrl}
                            alt={produto.nome}
                            sx={{
                                height: "100%",
                                objectFit: "cover",
                                opacity: esgotado ? 0.35 : 1,
                            }}
                            />
                        ) : (
                            <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
                            <Inventory2Outlined
                                sx={{ fontSize: 56, color: "text.secondary", opacity: 0.4 }}
                            />
                            </Box>
                        )}

                        {esgotado && (
                            <Chip
                            label="Esgotado"
                            color="error"
                            size="small"
                            sx={{ position: "absolute", top: 12, left: 12, fontWeight: 800 }}
                            />
                        )}
                        </Box>

                        <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.25, mb: 0.5 }}>
                            {produto.nome}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                            mb: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            }}
                        >
                            {produto.descricao || "Sem descrição"}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 900, color: "primary.main", letterSpacing: -0.5 }}
                        >
                            {formatMoney(produto.preco)}
                        </Typography>
                        {!esgotado && (
                            <Typography variant="caption" color="text.secondary">
                            {produto.estoque} em estoque
                            </Typography>
                        )}
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartOutlined />}
                            disabled={esgotado}
                            onClick={() => adicionarAoCarrinho(produto)}
                        >
                            {esgotado ? "Esgotado" : "Adicionar"}
                        </Button>
                        </CardActions>
                    </Card>
                    </Grid>
                );
                })}
            </Grid>
            </Box>

            <Paper
            variant="outlined"
            sx={{
                width: { xs: "100%", lg: 380 },
                flexShrink: 0,
                p: 3,
                borderRadius: 3,
                position: { lg: "sticky" },
                top: { lg: 88 },
            }}
            >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Badge badgeContent={totalItens} color="primary">
                <ShoppingBagOutlined sx={{ color: "primary.main" }} />
                </Badge>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Seu carrinho
                </Typography>
            </Box>

            {carrinho.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                <ShoppingCartOutlined
                    sx={{ fontSize: 44, color: "text.secondary", opacity: 0.4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                    O carrinho está vazio.
                </Typography>
                </Box>
            ) : (
                <>
                <Box
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxHeight: 280,
                    overflowY: "auto",
                    pr: 0.5,
                    }}
                >
                    {carrinho.map((item) => (
                    <Box key={item.produto.id}>
                        <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 1,
                        }}
                        >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                            {item.produto.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                            {formatMoney(item.produto.preco)} un.
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                            {formatMoney(Number(item.produto.preco) * item.quantidade)}
                        </Typography>
                        </Box>

                        <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 0.5,
                        }}
                        >
                        <Box
                            sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            }}
                        >
                            <IconButton
                            size="small"
                            aria-label="Diminuir quantidade"
                            onClick={() => alterarQuantidade(item.produto.id, -1)}
                            >
                            <Remove fontSize="small" />
                            </IconButton>
                            <Typography
                            variant="body2"
                            sx={{ minWidth: 28, textAlign: "center", fontWeight: 800 }}
                            >
                            {item.quantidade}
                            </Typography>
                            <IconButton
                            size="small"
                            aria-label="Aumentar quantidade"
                            onClick={() => alterarQuantidade(item.produto.id, 1)}
                            >
                            <Add fontSize="small" />
                            </IconButton>
                        </Box>

                        <IconButton
                            size="small"
                            color="error"
                            aria-label="Remover item"
                            onClick={() => removerItem(item.produto.id)}
                        >
                            <DeleteOutlined fontSize="small" />
                        </IconButton>
                        </Box>
                    </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ mb: 2.5 }}>
                    <AppSelectField
                    label="Forma de pagamento"
                    value={metodoPagamento}
                    options={[{ value: "PAGAR_NA_RETIRADA", label: "Pagar na retirada" }]}
                    disabled
                    />
                </Box>

                <Box
                    sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    mb: 2.5,
                    }}
                >
                    <Typography
                    variant="overline"
                    sx={{ fontWeight: 800, letterSpacing: 1.5, color: "text.secondary" }}
                    >
                    Total
                    </Typography>
                    <Typography
                    variant="h5"
                    sx={{ fontWeight: 900, color: "primary.main", letterSpacing: -0.5 }}
                    >
                    {formatMoney(calcularTotal())}
                    </Typography>
                </Box>

                <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={submitting}
                    onClick={handleIniciarCheckout}
                    sx={{ py: 1.4 }}
                >
                    Finalizar pedido
                </Button>
                </>
            )}
            </Paper>
        </Box>
        );
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
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
            <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
                <TableHead>
                <TableRow sx={{ bgcolor: (t) => alpha(t.palette.text.primary, 0.04) }}>
                    <TableCell sx={headCellSx}>Pedido</TableCell>
                    {isAdminOrSuperAdmin && <TableCell sx={headCellSx}>Aluno</TableCell>}
                    <TableCell sx={headCellSx}>Data</TableCell>
                    <TableCell sx={headCellSx}>Pagamento</TableCell>
                    <TableCell sx={headCellSx}>Status</TableCell>
                    <TableCell align="right" sx={headCellSx}>
                    Valor total
                    </TableCell>
                    {isAdminOrSuperAdmin && (
                    <TableCell align="center" sx={headCellSx}>
                        Ações
                    </TableCell>
                    )}
                </TableRow>
                </TableHead>

                <TableBody>
                {pedidos.map((pedido: any) => (
                    <TableRow
                    key={pedido.id}
                    hover
                    sx={{
                        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
                        "&:last-child td": { borderBottom: 0 },
                    }}
                    >
                    <TableCell sx={{ fontWeight: 800, borderBottomColor: "divider" }}>
                        #{pedido.id}
                    </TableCell>
                    {isAdminOrSuperAdmin && (
                        <TableCell sx={{ borderBottomColor: "divider" }}>
                        {pedido.alunoNome || pedido.usuarioNome || ultimoNomeBuscado}
                        </TableCell>
                    )}
                    <TableCell sx={{ borderBottomColor: "divider" }}>
                        {formatarData(pedido)}
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: "divider" }}>
                        {formatarPagamento(pedido.metodoPagamento)}
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: "divider" }}>
                        <Chip
                        label={String(pedido.status || "-").replace(/_/g, " ").toLowerCase()}
                        color={statusColor(pedido.status)}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700, textTransform: "capitalize" }}
                        />
                    </TableCell>
                    <TableCell
                        align="right"
                        sx={{ fontWeight: 800, color: "primary.main", borderBottomColor: "divider" }}
                    >
                        {formatMoney(pedido.valorTotal)}
                    </TableCell>
                    {isAdminOrSuperAdmin && (
                        <TableCell align="center" sx={{ borderBottomColor: "divider" }}>
                        <IconButton
                            size="small"
                            aria-label="Alterar status"
                            onClick={(e) => handleOpenStatusMenu(e, pedido)}
                        >
                            <MoreVert fontSize="small" />
                        </IconButton>
                        </TableCell>
                    )}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Paper>
        );
    };

    return (
        <>
        <LoadingOverlay open={submitting} />

        <CrudPage
            toolbar={
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
                aria-label="Abas da loja"
                variant="scrollable"
                allowScrollButtonsMobile
                sx={{
                    mt: -3,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "& .MuiTab-root": { fontWeight: 800, minHeight: 56 },
                }}
                >
                <Tab icon={<StorefrontOutlined />} iconPosition="start" label="Vitrine" />
                <Tab
                    icon={<ListAltOutlined />}
                    iconPosition="start"
                    label={isAdminOrSuperAdmin ? "Gerenciar pedidos" : "Meus pedidos"}
                />
                </Tabs>

                {currentTab === 1 && isAdminOrSuperAdmin && (
                <Paper
                    variant="outlined"
                    component="form"
                    onSubmit={handleBuscarAlunoSubmit}
                    sx={{
                    mt: 3,
                    p: 2.5,
                    borderRadius: 3,
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "center",
                    }}
                >
                    <TextField
                    size="small"
                    label="Nome do aluno"
                    placeholder="Digite o nome do aluno..."
                    value={nomeAlunoBusca}
                    onChange={(e) => setNomeAlunoBusca(e.target.value)}
                    sx={{ minWidth: 220, flex: { xs: "1 1 100%", sm: "1 1 260px" } }}
                    slotProps={{
                        input: {
                        startAdornment: (
                            <InputAdornment position="start">
                            <Search fontSize="small" sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                        },
                    }}
                    />

                    <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Search />}
                    disabled={loadingPedidos}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                    Buscar
                    </Button>

                    {(nomeAlunoBusca || ultimoNomeBuscado) && (
                    <Button
                        type="button"
                        color="inherit"
                        startIcon={<Clear />}
                        disabled={loadingPedidos}
                        onClick={handleLimparBuscaAluno}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        Limpar
                    </Button>
                    )}
                </Paper>
                )}
            </Box>
            }
            table={
            currentTab === 0 ? (
                renderVitrine()
            ) : (
                <Box>
                {renderTabelaPedidos()}

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseStatusMenu}
                    slotProps={{
                    paper: {
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 2, mt: 0.5 },
                    },
                    }}
                >
                    <MenuItem onClick={() => alterarStatusAdmin("CONCLUIDO")}>
                    <ListItemIcon sx={{ color: "success.main" }}>
                        <CheckCircleOutlined fontSize="small" />
                    </ListItemIcon>
                    Dar baixa / concluir
                    </MenuItem>
                    <MenuItem onClick={() => alterarStatusAdmin("PENDENTE_PAGAMENTO")}>
                    <ListItemIcon sx={{ color: "warning.main" }}>
                        <HourglassEmpty fontSize="small" />
                    </ListItemIcon>
                    Marcar pendente
                    </MenuItem>
                    <MenuItem onClick={() => alterarStatusAdmin("CANCELADO")}>
                    <ListItemIcon sx={{ color: "error.main" }}>
                        <BlockOutlined fontSize="small" />
                    </ListItemIcon>
                    Cancelar pedido
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

        <ConfirmDialog
            open={confirmDialogOpen}
            severity="info"
            title="Confirmar pedido"
            message={`Deseja confirmar o pedido no valor total de ${formatMoney(
            calcularTotal()
            )}? Ele ficará reservado para retirada por 24 horas, a partir de agora, na recepção da academia.`}
            confirmText="Confirmar pedido"
            onCancel={() => setConfirmDialogOpen(false)}
            onConfirm={confirmarEFinalizarPedido}
        />

        <AppSnackbar
            open={notification.open}
            message={notification.message}
            severity={notification.severity}
            onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        />
        </>
    );
}