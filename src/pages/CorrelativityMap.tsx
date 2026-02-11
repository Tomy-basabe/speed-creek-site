
import { useCallback, useMemo, useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    MarkerType,
    Node,
    Edge,
    Position,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, ZoomIn, ZoomOut, Zap, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "@/hooks/useSubjects";
import dagre from 'dagre';
import { Loader2 } from "lucide-react";
import { SubjectNode } from "@/components/correlativity/SubjectNode";

// --- Error Boundary Component ---
class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Map Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Algo salió mal con el mapa</h2>
                    <p className="text-muted-foreground mb-4">Intenta recargar la página.</p>
                    <Button onClick={() => window.location.reload()}>Recargar</Button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Register custom node types
const nodeTypes = {
    subject: SubjectNode,
};

// Layout configuration
const nodeWidth = 250;
const nodeHeight = 100;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: Position.Left,
            sourcePosition: Position.Right,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: newNodes, edges };
};

function CorrelativityMapContent() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { subjects, loading } = useSubjects();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (loading || subjects.length === 0) return;

        try {
            const flowNodes: Node[] = subjects.map((subject) => {
                const isProject = subject.nombre.toLowerCase().includes('proyecto') || subject.nombre.toLowerCase().includes('tesis');

                return {
                    id: subject.id,
                    type: 'subject',
                    data: {
                        label: subject.nombre,
                        codigo: subject.codigo,
                        status: subject.status,
                        nota: subject.nota,
                        isProject: isProject
                    },
                    position: { x: 0, y: 0 },
                };
            });

            const flowEdges: Edge[] = [];

            subjects.forEach((subject) => {
                subject.dependencies.forEach((dep) => {
                    if (dep.requiere_aprobada) {
                        flowEdges.push({
                            id: `e-${dep.requiere_aprobada}-${subject.id}`,
                            source: dep.requiere_aprobada,
                            target: subject.id,
                            type: 'default', // Bezier by default in recent versions or 'default'
                            animated: true,
                            markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' },
                            style: { stroke: '#22c55e', strokeWidth: 2, opacity: 0.8 },
                        });
                    }
                    if (dep.requiere_regular) {
                        flowEdges.push({
                            id: `e-${dep.requiere_regular}-${subject.id}`,
                            source: dep.requiere_regular,
                            target: subject.id,
                            type: 'default',
                            animated: true,
                            markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
                            style: { stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5,5', opacity: 0.8 },
                        });
                    }
                });
            });

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                flowNodes,
                flowEdges
            );

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        } catch (err) {
            console.error("Error calculating layout:", err);
        }

    }, [subjects, loading, setNodes, setEdges]);


    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-background text-foreground"><Loader2 className="animate-spin mr-2" /> Cargando mapa...</div>;
    }

    return (
        <div className="h-screen w-full bg-background flex flex-col relative overflow-hidden">
            <div className="absolute top-4 left-4 z-50 flex gap-2 items-center">
                <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="bg-background/50 backdrop-blur hover:bg-background">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Card className="px-4 py-2 bg-background/50 backdrop-blur border-border/50 shadow-sm flex items-center gap-4">
                    <h1 className="font-bold text-lg gradient-text flex items-center gap-2">
                        <Zap className="text-neon-gold w-4 h-4" />
                        Mapa de Correlatividades
                    </h1>
                </Card>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Card className="px-4 py-2 bg-background/80 backdrop-blur border-border/50 shadow-lg flex gap-4 text-xs rounded-full">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>Aprobada</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>Regular</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>Cursable</div>
                    <div className="flex items-center gap-1.5 opacity-50"><div className="w-2 h-2 rounded-full bg-gray-500"></div>Bloqueada</div>
                </Card>
            </div>

            <div className="flex-1 w-full h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    className="bg-background"
                    colorMode="dark"
                    minZoom={0.1}
                    proOptions={{ hideAttribution: true }}
                    defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
                >
                    <Controls className="bg-card border-border text-foreground fill-foreground" position="bottom-right" />
                    <MiniMap className="bg-card border-border" nodeColor="#10b981" maskColor="rgba(0,0,0,0.6)" position="bottom-left" />
                    <Background gap={25} size={1} color="#444" variant={BackgroundVariant.Dots} />
                </ReactFlow>
            </div>
        </div>
    );
}

export default function CorrelativityMap() {
    return (
        <MapErrorBoundary>
            <CorrelativityMapContent />
        </MapErrorBoundary>
    );
}
