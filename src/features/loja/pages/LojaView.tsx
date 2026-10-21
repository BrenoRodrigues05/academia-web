import { useState } from "react";
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
    MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import useProdutos from "../hooks/useProdutos";
import pedidoService from "../api/PedidoService";
import type { Produto, ItemCarrinho, MetodoPagamentoLoja } from "../types";
import { AppLoading } from "@/components/ui";

export default function LojaView() {
    const { data: produtosData, loading } = useProdutos();
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamentoLoja>("PAGAR_NA_RETIRADA");
    const [submitting, setSubmitting] = useState(false);

    const produtos: Produto[] = Array.isArray(produtosData)
        ? produtosData
        : Array.isArray(produtosData?.content)
        ? produtosData.content
        : [];

    const adicionarAoCarrinho = (produto: Produto) => {
        setCarrinho((prev) => {
            const index = prev.findIndex((item) => item.produto.id === produto.id);
            if (index >= 0) {
                const itemAtual = prev[index];
                if (itemAtual.quantidade >= produto.estoque) {
                    alert("Estoque máximo atingido para este produto.");
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

    const finalizarPedido = async () => {
        if (carrinho.length === 0) return;

        setSubmitting(true);
        try {
            const payload = {
                itens: carrinho.map((item) => ({
                    produtoId: item.produto.id,
                    quantidade: item.quantidade,
                })),
                metodoPagamento: metodoPagamento as "PIX" | "PAGAR_NA_RETIRADA",
            };

            const response = await pedidoService.criarPedido(payload);
            alert(`Pedido #${response.id} realizado com sucesso!`);
            setCarrinho([]);
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao finalizar pedido.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <AppLoading />;
    }

    return (
        <Box sx={{ display: "flex", gap: 3, p: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                    Loja da Academia
                </Typography>

                <Grid container spacing={3}>
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

            <Paper elevation={2} sx={{ width: { xs: "100%", md: "350px" }, p: 2, height: "fit-content" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Seu Carrinho
                </Typography>

                {carrinho.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        O carrinho está vazio.
                    </Typography>
                ) : (
                    <>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                            {carrinho.map((item) => (
                                <Box key={item.produto.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            {item.produto.nome}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            R$ {Number(item.produto.preco).toFixed(2)} un.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                                    onChange={(e) => setMetodoPagamento(e.target.value as MetodoPagamentoLoja)}
                                >
                                    <MenuItem value="PAGAR_NA_RETIRADA">Pagar na Retirada</MenuItem>
                                    <MenuItem value="PIX">Pix (Online)</MenuItem>
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
                            onClick={finalizarPedido}
                        >
                            {submitting ? "Processando..." : "Finalizar Pedido"}
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
}