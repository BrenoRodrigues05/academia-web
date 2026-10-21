import { useState, useEffect } from "react";
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
    Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ListAltIcon from "@mui/icons-material/ListAlt";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import { LoadingOverlay } from "@/components/feedback";
import { AppLoading, AppPagination } from "@/components/ui";

import useProdutos from "../hooks/useProdutos";
import pedidoService from "../api/PedidoService";
import type { Produto, ItemCarrinho, MetodoPagamentoLoja, PedidoResponse } from "../types";

export default function LojaView() {
    const { data: produtosData, loading, page, setPage } = useProdutos();
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [metodoPagamento] = useState<MetodoPagamentoLoja>("PAGAR_NA_RETIRADA");
    const [submitting, setSubmitting] = useState(false);

    const [currentTab, setCurrentTab] = useState<number>(0); 
    const [meusPedidos, setMeusPedidos] = useState<PedidoResponse[]>([]);
    const [loadingPedidos, setLoadingPedidos] = useState<boolean>(false);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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

    useEffect(() => {
        if (currentTab === 1) {
            carregarMeusPedidos();
        }
    }, [currentTab]);

    const carregarMeusPedidos = async () => {
        setLoadingPedidos(true);
        try {
            const data = await pedidoService.listarMeusPedidos();
            setMeusPedidos(data);
        } catch (error) {
            setNotification({ open: true, message: "Erro ao carregar seus pedidos.", severity: "error" });
        } finally {
            setLoadingPedidos(false);
        }
    };

    const adicionarAoCarrinho = (produto: Produto) => {
        setCarrinho((prev) => {
            const index = prev.findIndex((item) => item.produto.id === produto.id);
            if (index >= 0) {
                const itemAtual = prev[index];
                if (itemAtual.quantidade >= produto.estoque) {
                    setNotification({ open: true, message: "Estoque máximo atingido para este produto.", severity: "warning" });
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
        setCarrinho((prev) => {
            return prev
                .map((item) => {
                    if (item.produto.id === produtoId) {
                        const novaQtd = item.quantidade + delta;
                        if (novaQtd > item.produto.estoque) return item;
                        return { ...item, quantidade: novaQtd };
                    }
                    return item;
                })
                .filter((item) => item.quantidade > 0);
        });
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

            carregarMeusPedidos();
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

    if (loading) {
        return <AppLoading />;
    }

    return (
        <>
            <LoadingOverlay open={submitting} />

            <CrudPage
                toolbar={
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Box sx={{ flexGrow: 1, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                            <CrudToolbar
                                title="Loja da Academia"
                                subtitle="Compre suplementos, acessórios e itens oficiais"
                                onCreate={undefined as any} 
                            />
                            <Tabs value={currentTab} onChange={(_, val) => setCurrentTab(val)} aria-label="abas da loja">
                                <Tab icon={<StorefrontIcon />} iconPosition="start" label="Vitrine" />
                                <Tab icon={<ListAltIcon />} iconPosition="start" label="Meus Pedidos" />
                            </Tabs>
                        </Box>
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
                                                    <Typography variant="caption" color={produto.estoque === 0 ? "error" : "text.secondary"}>
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
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2, maxHeight: "250px", overflowY: "auto" }}>
                                            {carrinho.map((item) => (
                                                <Box key={item.produto.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Box sx={{ maxWidth: "160px" }}>
                                                        <Typography variant="body2" sx={{ fontWeight: "bold" }} noWrap>
                                                            {item.produto.nome}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            R$ {Number(item.produto.preco).toFixed(2)} un.
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <IconButton size="small" onClick={() => alterarQuantidade(item.produto.id, -1)}>
                                                            <RemoveIcon fontSize="small" />
                                                        </IconButton>
                                                        <Typography variant="body2">{item.quantidade}</Typography>
                                                        <IconButton size="small" onClick={() => alterarQuantidade(item.produto.id, 1)}>
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => removerItem(item.produto.id)}>
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
                                                <Select
                                                    value={metodoPagamento}
                                                    label="Forma de Pagamento"
                                                    disabled
                                                >
                                                    <MenuItem value="PAGAR_NA_RETIRADA">Pagar na Retirada</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Total:</Typography>
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
                            {loadingPedidos ? (
                                <AppLoading />
                            ) : meusPedidos.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                                    Você ainda não realizou nenhum pedido.
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} elevation={1}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>ID</strong></TableCell>
                                                <TableCell><strong>Data</strong></TableCell>
                                                <TableCell><strong>Pagamento</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                                <TableCell align="right"><strong>Valor Total</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {meusPedidos.map((pedido) => (
                                                <TableRow key={pedido.id} hover>
                                                    <TableCell>#{pedido.id}</TableCell>
                                                    <TableCell>
                                                            {pedido.createdAt
                                                                ? new Date(pedido.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                                                                : "-"}
                                                        </TableCell>
                                                    <TableCell>{pedido.metodoPagamento === "PAGAR_NA_RETIRADA" ? "Pagar na Retirada" : "Pix"}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={pedido.status}
                                                            color={pedido.status.includes("RESERVADO") ? "warning" : "success"}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                                        R$ {Number(pedido.valorTotal).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
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
                        Deseja confirmar a realização deste pedido no valor total de <strong>R$ {calcularTotal().toFixed(2)}</strong>?
                    </Typography>

                    <Alert severity="info" sx={{ fontSize: "0.85rem" }}>
                        O pedido ficará reservado e disponível para retirada por <strong>24 horas</strong> a partir de agora na recepção da academia.
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