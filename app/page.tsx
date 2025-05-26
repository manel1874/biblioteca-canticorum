"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Music,
  Download,
  Play,
  Plus,
  Trash2,
  FileText,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface PartituraMusical {
  id: string
  titulo: string
  compositor: string
  estilo: string
  tipoLiturgico: string[]
  nivel: string
  urlAudio: string
  urlPdf: string
  descricao: string
  duracao: string
}

interface MissaRepertorio {
  [key: string]: PartituraMusical[]
}

const tiposLiturgicos = [
  "Entrada",
  "Acto penitencial",
  "Glória",
  "Salmo",
  "Aclamação do Evangelho",
  "Credo",
  "Consentimento",
  "Ofertório",
  "Santo",
  "Consagração",
  "Cordeiro de Deus",
  "Comunhão",
  "Acção de Graças",
  "Final",
]

const partiturasExemplo: PartituraMusical[] = [
  {
    id: "1",
    titulo: "Kyrie Eleison em Ré Maior",
    compositor: "Johann Sebastian Bach",
    estilo: "Barroco",
    tipoLiturgico: ["Acto penitencial"],
    nivel: "Avançado",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Uma bela composição do Kyrie em estilo barroco tradicional",
    duracao: "3:45",
  },
  {
    id: "2",
    titulo: "Sanctus Dominus",
    compositor: "Wolfgang Amadeus Mozart",
    estilo: "Clássico",
    tipoLiturgico: ["Santo"],
    nivel: "Intermediário",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Elegante composição clássica adequada para Missa dominical",
    duracao: "4:20",
  },
  {
    id: "3",
    titulo: "Aleluia Jubilate",
    compositor: "Giovanni Pierluigi da Palestrina",
    estilo: "Renascentista",
    tipoLiturgico: ["Aclamação do Evangelho"],
    nivel: "Avançado",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Aleluia polifônico tradicional para o tempo pascal",
    duracao: "2:30",
  },
  {
    id: "4",
    titulo: "Agnus Dei",
    compositor: "Gabriel Fauré",
    estilo: "Romântico",
    tipoLiturgico: ["Cordeiro de Deus"],
    nivel: "Intermediário",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Composição suave e contemplativa do Requiem",
    duracao: "5:15",
  },
  {
    id: "5",
    titulo: "Gloria in Excelsis",
    compositor: "Antonio Vivaldi",
    estilo: "Barroco",
    tipoLiturgico: ["Glória"],
    nivel: "Avançado",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Composição alegre e triunfante do Glória",
    duracao: "6:30",
  },
  {
    id: "6",
    titulo: "Kyrie Simples",
    compositor: "Tradicional",
    estilo: "Contemporâneo",
    tipoLiturgico: ["Acto penitencial"],
    nivel: "Iniciante",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Composição fácil de aprender para coros paroquiais",
    duracao: "2:00",
  },
  {
    id: "7",
    titulo: "Credo in Unum Deum",
    compositor: "Ludwig van Beethoven",
    estilo: "Clássico",
    tipoLiturgico: ["Credo"],
    nivel: "Avançado",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Poderosa declaração de fé da Missa Solemnis",
    duracao: "8:45",
  },
  {
    id: "8",
    titulo: "Panis Angelicus",
    compositor: "César Franck",
    estilo: "Romântico",
    tipoLiturgico: ["Comunhão"],
    nivel: "Intermediário",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Belo hino de comunhão para ocasiões especiais",
    duracao: "4:00",
  },
  {
    id: "9",
    titulo: "Ave Maria",
    compositor: "Franz Schubert",
    estilo: "Romântico",
    tipoLiturgico: ["Entrada", "Ofertório", "Comunhão"],
    nivel: "Intermediário",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Clássica oração mariana em melodia sublime, adequada para vários momentos da liturgia",
    duracao: "3:30",
  },
  {
    id: "10",
    titulo: "Te Deum Laudamus",
    compositor: "Marc-Antoine Charpentier",
    estilo: "Barroco",
    tipoLiturgico: ["Acção de Graças", "Final"],
    nivel: "Avançado",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Majestoso hino de louvor e ação de graças",
    duracao: "7:15",
  },
  {
    id: "11",
    titulo: "Veni Creator Spiritus",
    compositor: "Tradicional Gregoriano",
    estilo: "Gregoriano",
    tipoLiturgico: ["Entrada", "Consagração"],
    nivel: "Iniciante",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Antigo hino ao Espírito Santo em canto gregoriano",
    duracao: "4:45",
  },
  {
    id: "12",
    titulo: "Salve Regina",
    compositor: "Giovanni Battista Pergolesi",
    estilo: "Barroco",
    tipoLiturgico: ["Final"],
    nivel: "Intermediário",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Antífona mariana em estilo barroco expressivo",
    duracao: "5:00",
  },
  {
    id: "13",
    titulo: "Salmo Responsorial 23",
    compositor: "Tradicional",
    estilo: "Contemporâneo",
    tipoLiturgico: ["Salmo"],
    nivel: "Iniciante",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "O Senhor é meu pastor, nada me faltará",
    duracao: "2:45",
  },
  {
    id: "14",
    titulo: "Hino de Entrada Pascal",
    compositor: "Tradicional",
    estilo: "Contemporâneo",
    tipoLiturgico: ["Entrada"],
    nivel: "Iniciante",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Canto alegre para a entrada da Missa pascal",
    duracao: "3:15",
  },
  {
    id: "15",
    titulo: "Oração Eucarística",
    compositor: "Moderno",
    estilo: "Contemporâneo",
    tipoLiturgico: ["Consagração", "Santo"],
    nivel: "Intermediário",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Música para acompanhar a oração eucarística",
    duracao: "6:00",
  },
  {
    id: "16",
    titulo: "Consentimento Solene",
    compositor: "Tradicional",
    estilo: "Contemporâneo",
    tipoLiturgico: ["Consentimento"],
    nivel: "Iniciante",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Música para o momento do consentimento matrimonial",
    duracao: "2:30",
  },
  {
    id: "17",
    titulo: "Sim, Eu Aceito",
    compositor: "Moderno",
    estilo: "Contemporâneo",
    tipoLiturgico: ["Consentimento"],
    nivel: "Iniciante",
    urlAudio: "https://www.youtube.com/watch?v=xoX-PLEjQt8",
    urlPdf: "/placeholder-score.pdf",
    descricao: "Canção moderna para cerimônias de casamento",
    duracao: "3:00",
  },
]

interface SortableItemProps {
  partitura: PartituraMusical
  tipo: string
  onRemove: (id: string, tipo: string) => void
}

function SortableItem({ partitura, tipo, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: partitura.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-2 bg-white rounded border ${
        isDragging ? "shadow-lg border-blue-300" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-2 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{partitura.titulo}</p>
          <p className="text-xs text-muted-foreground">{partitura.compositor}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onRemove(partitura.id, tipo)} className="h-8 w-8 p-0">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function BibliotecaMusicaLiturgica() {
  const [termoPesquisa, setTermoPesquisa] = useState("")
  const [estiloSelecionado, setEstiloSelecionado] = useState("todos")
  const [tipoSelecionado, setTipoSelecionado] = useState("todos")
  const [nivelSelecionado, setNivelSelecionado] = useState("todos")
  const [compositorSelecionado, setCompositorSelecionado] = useState("todos")
  const [repertorioMissa, setRepertorioMissa] = useState<MissaRepertorio>({})
  const [tocandoAtualmente, setTocandoAtualmente] = useState<string | null>(null)
  const [tiposExpandidos, setTiposExpandidos] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()
  const [niveisAutomaticos, setNiveisAutomaticos] = useState<string[]>([])
  const [estilosAutomaticos, setEstilosAutomaticos] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const estilos = [...new Set(partiturasExemplo.map((partitura) => partitura.estilo))]
  const tipos = [...new Set(partiturasExemplo.flatMap((partitura) => partitura.tipoLiturgico))]
  const niveis = [...new Set(partiturasExemplo.map((partitura) => partitura.nivel))]
  const compositores = [...new Set(partiturasExemplo.map((partitura) => partitura.compositor))]

  const partiturasFiltradas = useMemo(() => {
    return partiturasExemplo.filter((partitura) => {
      const correspondeTermoPesquisa =
        partitura.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        partitura.compositor.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        partitura.descricao.toLowerCase().includes(termoPesquisa.toLowerCase())
      const correspondeEstilo = estiloSelecionado === "todos" || partitura.estilo === estiloSelecionado
      const correspondeTipo = tipoSelecionado === "todos" || partitura.tipoLiturgico.includes(tipoSelecionado)
      const correspondeNivel = nivelSelecionado === "todos" || partitura.nivel === nivelSelecionado
      const correspondeCompositor = compositorSelecionado === "todos" || partitura.compositor === compositorSelecionado

      return (
        correspondeTermoPesquisa && correspondeEstilo && correspondeTipo && correspondeNivel && correspondeCompositor
      )
    })
  }, [termoPesquisa, estiloSelecionado, tipoSelecionado, nivelSelecionado, compositorSelecionado])

  const adicionarAoTipo = (partitura: PartituraMusical, tipo: string) => {
    const novoRepertorio = { ...repertorioMissa }
    if (!novoRepertorio[tipo]) {
      novoRepertorio[tipo] = []
    }

    if (!novoRepertorio[tipo].find((p) => p.id === partitura.id)) {
      novoRepertorio[tipo].push(partitura)
      setRepertorioMissa(novoRepertorio)
      toast({
        title: "Adicionado ao Repertório",
        description: `"${partitura.titulo}" foi adicionado a ${tipo}.`,
      })
    } else {
      toast({
        title: "Já Adicionado",
        description: `"${partitura.titulo}" já está em ${tipo}.`,
        variant: "destructive",
      })
    }
  }

  const removerDoTipo = (partituraId: string, tipo: string) => {
    const novoRepertorio = { ...repertorioMissa }
    if (novoRepertorio[tipo]) {
      novoRepertorio[tipo] = novoRepertorio[tipo].filter((p) => p.id !== partituraId)
      if (novoRepertorio[tipo].length === 0) {
        delete novoRepertorio[tipo]
      }
    }
    setRepertorioMissa(novoRepertorio)
    toast({
      title: "Removido do Repertório",
      description: "Partitura foi removida do repertório da Missa.",
    })
  }

  const handleDragEnd = (event: DragEndEvent, tipo: string) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const novoRepertorio = { ...repertorioMissa }
      const partituras = novoRepertorio[tipo] || []

      const oldIndex = partituras.findIndex((p) => p.id === active.id)
      const newIndex = partituras.findIndex((p) => p.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        novoRepertorio[tipo] = arrayMove(partituras, oldIndex, newIndex)
        setRepertorioMissa(novoRepertorio)
      }
    }
  }

  const gerarMissaAutomatica = () => {
    const novoRepertorio: MissaRepertorio = {}
    let totalAdicionadas = 0

    tiposLiturgicos.forEach((tipo) => {
      // Find songs that match this liturgical type
      let candidatos = partiturasExemplo.filter((partitura) => partitura.tipoLiturgico.includes(tipo))

      // Filter by selected levels (if any specific levels are selected)
      if (niveisAutomaticos.length > 0) {
        candidatos = candidatos.filter((partitura) => niveisAutomaticos.includes(partitura.nivel))
      }

      // Filter by selected styles (if any specific styles are selected)
      if (estilosAutomaticos.length > 0) {
        candidatos = candidatos.filter((partitura) => estilosAutomaticos.includes(partitura.estilo))
      }

      if (candidatos.length === 0) return

      // Pick a random song from the filtered candidates
      const selecionada = candidatos[Math.floor(Math.random() * candidatos.length)]

      if (selecionada) {
        novoRepertorio[tipo] = [selecionada]
        totalAdicionadas++
      }
    })

    setRepertorioMissa(novoRepertorio)

    const niveisTexto = niveisAutomaticos.length === 0 ? "todos os níveis" : niveisAutomaticos.join(", ")
    const estilosTexto = estilosAutomaticos.length === 0 ? "todos os estilos" : estilosAutomaticos.join(", ")

    toast({
      title: "Missa Gerada Automaticamente",
      description: `${totalAdicionadas} partituras foram selecionadas para ${Object.keys(novoRepertorio).length} tipos litúrgicos usando ${niveisTexto} e ${estilosTexto}.`,
    })
  }

  const exportarMissaPDF = () => {
    const totalPartituras = Object.values(repertorioMissa).flat().length
    if (totalPartituras === 0) {
      toast({
        title: "Nenhuma Partitura Selecionada",
        description: "Por favor, adicione algumas partituras ao seu repertório de Missa primeiro.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Exportar PDF",
      description: `Exportando ${totalPartituras} partituras para PDF...`,
    })
  }

  const limparFiltros = () => {
    setTermoPesquisa("")
    setEstiloSelecionado("todos")
    setTipoSelecionado("todos")
    setNivelSelecionado("todos")
    setCompositorSelecionado("todos")
  }

  const toggleTipoExpandido = (tipo: string) => {
    setTiposExpandidos((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }))
  }

  const tipoTemPartituras = (tipo: string) => {
    return repertorioMissa[tipo] && repertorioMissa[tipo].length > 0
  }

  const tiposCobertos = tiposLiturgicos.filter((tipo) => tipoTemPartituras(tipo)).length
  const totalTipos = tiposLiturgicos.length

  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Biblioteca do Canticorum</h1>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <FileText className="h-4 w-4 mr-2" />
                  Construtor de Missa
                  <Badge className="ml-2 px-2 py-1 text-xs">
                    {tiposCobertos}/{totalTipos}
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[500px] md:w-[600px] max-w-full flex flex-col">
                <SheetHeader className="pb-4 flex-shrink-0">
                  <SheetTitle className="text-lg sm:text-xl">Construtor de Missa</SheetTitle>
                </SheetHeader>
                <div className="flex justify-end mt-2 mb-4 flex-shrink-0">
                  <Button onClick={exportarMissaPDF} size="sm" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>

                <ScrollArea className="flex-1 -mx-6 px-6">
                  <div className="mt-6">
                    <Tabs defaultValue="automatico" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 h-auto">
                        <TabsTrigger value="automatico" className="text-xs sm:text-sm px-2 py-2">
                          Automático
                        </TabsTrigger>
                        <TabsTrigger value="repertorio" className="text-xs sm:text-sm px-2 py-2">
                          Repertório
                        </TabsTrigger>
                        <TabsTrigger value="resumo" className="text-xs sm:text-sm px-2 py-2">
                          Resumo
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="automatico" className="mt-4 px-1">
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="text-lg font-medium mb-2">Gerador Automático de Missa</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Selecione um nível de dificuldade e gere automaticamente uma missa completa
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Níveis de Dificuldade</label>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id="todos-niveis"
                                      checked={niveisAutomaticos.length === 0}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setNiveisAutomaticos([])
                                        }
                                      }}
                                      className="rounded"
                                    />
                                    <label htmlFor="todos-niveis" className="text-sm">
                                      Todos os Níveis
                                    </label>
                                  </div>
                                  {niveis.map((nivel) => (
                                    <div key={nivel} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id={`nivel-${nivel}`}
                                        checked={niveisAutomaticos.includes(nivel)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setNiveisAutomaticos([...niveisAutomaticos, nivel])
                                          } else {
                                            setNiveisAutomaticos(niveisAutomaticos.filter((n) => n !== nivel))
                                          }
                                        }}
                                        className="rounded"
                                      />
                                      <label htmlFor={`nivel-${nivel}`} className="text-sm">
                                        {nivel}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">Estilos Musicais</label>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id="todos-estilos"
                                      checked={estilosAutomaticos.length === 0}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEstilosAutomaticos([])
                                        }
                                      }}
                                      className="rounded"
                                    />
                                    <label htmlFor="todos-estilos" className="text-sm">
                                      Todos os Estilos
                                    </label>
                                  </div>
                                  {estilos.map((estilo) => (
                                    <div key={estilo} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id={`estilo-${estilo}`}
                                        checked={estilosAutomaticos.includes(estilo)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setEstilosAutomaticos([...estilosAutomaticos, estilo])
                                          } else {
                                            setEstilosAutomaticos(estilosAutomaticos.filter((e) => e !== estilo))
                                          }
                                        }}
                                        className="rounded"
                                      />
                                      <label htmlFor={`estilo-${estilo}`} className="text-sm">
                                        {estilo}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button onClick={gerarMissaAutomatica} className="w-full">
                                <Music className="h-4 w-4 mr-2" />
                                Gerar Missa Automática
                              </Button>
                              <p className="text-xs text-muted-foreground text-center">
                                Isso substituirá o repertório atual
                              </p>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Como funciona:</h4>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Seleciona automaticamente uma música para cada tipo litúrgico</li>
                                <li>• Filtra por níveis e estilos selecionados</li>
                                <li>• Use "Todos" para incluir todas as opções disponíveis</li>
                                <li>• Combina múltiplos níveis e estilos conforme selecionado</li>
                                <li>• Gera uma missa personalizada em segundos</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="repertorio" className="mt-4 px-1">
                        <ScrollArea className="h-[50vh] sm:h-[60vh]">
                          <div className="space-y-2">
                            {tiposLiturgicos.map((tipo) => {
                              const partituras = repertorioMissa[tipo] || []
                              const temPartituras = partituras.length > 0
                              const expandido = tiposExpandidos[tipo] || false

                              return (
                                <Card
                                  key={tipo}
                                  className={`${temPartituras ? "border-green-200 bg-green-50/50" : "border-gray-200"}`}
                                >
                                  <Collapsible open={expandido} onOpenChange={() => toggleTipoExpandido(tipo)}>
                                    <CollapsibleTrigger asChild>
                                      <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50/50">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            {temPartituras ? (
                                              <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                              <AlertCircle className="h-4 w-4 text-gray-400" />
                                            )}
                                            <CardTitle className="text-sm font-medium">{tipo}</CardTitle>
                                            <Badge variant="secondary" className="text-xs">
                                              {partituras.length}
                                            </Badge>
                                          </div>
                                          {expandido ? (
                                            <ChevronDown className="h-4 w-4" />
                                          ) : (
                                            <ChevronRight className="h-4 w-4" />
                                          )}
                                        </div>
                                      </CardHeader>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <CardContent className="pt-0">
                                        {partituras.length > 0 ? (
                                          <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={(event) => handleDragEnd(event, tipo)}
                                          >
                                            <SortableContext
                                              items={partituras.map((p) => p.id)}
                                              strategy={verticalListSortingStrategy}
                                            >
                                              <div className="space-y-2">
                                                {partituras.map((partitura) => (
                                                  <SortableItem
                                                    key={partitura.id}
                                                    partitura={partitura}
                                                    tipo={tipo}
                                                    onRemove={removerDoTipo}
                                                  />
                                                ))}
                                              </div>
                                            </SortableContext>
                                          </DndContext>
                                        ) : (
                                          <p className="text-sm text-muted-foreground italic">
                                            Nenhuma partitura selecionada para {tipo.toLowerCase()}
                                          </p>
                                        )}
                                      </CardContent>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </Card>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="resumo" className="mt-4 px-1">
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {tiposCobertos}/{totalTipos}
                            </div>
                            <p className="text-sm text-muted-foreground">Tipos litúrgicos cobertos</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {tiposLiturgicos.map((tipo) => (
                              <div
                                key={tipo}
                                className={`flex items-center space-x-2 p-2 rounded ${
                                  tipoTemPartituras(tipo) ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {tipoTemPartituras(tipo) ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <AlertCircle className="h-3 w-3" />
                                )}
                                <span>{tipo}</span>
                              </div>
                            ))}
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <h4 className="font-medium">Estatísticas</h4>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Total de partituras:</span>
                                <span>{Object.values(repertorioMissa).flat().length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tipos cobertos:</span>
                                <span>{tiposCobertos}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tipos em falta:</span>
                                <span>{totalTipos - tiposCobertos}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Pesquisa e Filtros */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por título, compositor ou descrição..."
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={compositorSelecionado} onValueChange={setCompositorSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Compositores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Compositores</SelectItem>
                {compositores.map((compositor) => (
                  <SelectItem key={compositor} value={compositor}>
                    {compositor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={estiloSelecionado} onValueChange={setEstiloSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Estilos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Estilos</SelectItem>
                {estilos.map((estilo) => (
                  <SelectItem key={estilo} value={estilo}>
                    {estilo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={nivelSelecionado} onValueChange={setNivelSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Níveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Níveis</SelectItem>
                {niveis.map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>
                    {nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {partiturasFiltradas.length} de {partiturasExemplo.length} partituras
          </p>
        </div>

        {/* Grade de Partituras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partiturasFiltradas.map((partitura) => (
            <Card key={partitura.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{partitura.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{partitura.compositor}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{partitura.descricao}</p>

                <div className="flex flex-wrap gap-2">
                  {partitura.tipoLiturgico.map((tipo, index) => (
                    <Badge key={index} variant="secondary">
                      {tipo}
                    </Badge>
                  ))}
                  <Badge variant="outline">{partitura.estilo}</Badge>
                  <Badge
                    variant={
                      partitura.nivel === "Iniciante"
                        ? "default"
                        : partitura.nivel === "Intermediário"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {partitura.nivel}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">Duração: {partitura.duracao}</div>

                <Separator />

                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(partitura.urlAudio, "_blank")}
                    className="flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span className="text-xs">Ouvir</span>
                  </Button>

                  <Button variant="ghost" size="sm" asChild>
                    <a href={partitura.urlPdf} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" />
                      <span className="text-xs">PDF</span>
                    </a>
                  </Button>
                </div>

                {/* Botões para adicionar aos tipos */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Adicionar ao repertório:</p>
                  <div className="flex flex-wrap gap-1">
                    {partitura.tipoLiturgico.map((tipo) => (
                      <Button
                        key={tipo}
                        variant="outline"
                        size="sm"
                        onClick={() => adicionarAoTipo(partitura, tipo)}
                        className="text-xs h-7"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tipo}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {partiturasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma partitura encontrada</h3>
            <p className="text-muted-foreground mb-4">Tente ajustar seus critérios de pesquisa ou filtros</p>
            <Button onClick={limparFiltros} variant="outline">
              Limpar Todos os Filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
