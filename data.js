function makePairs(raw) {
  return raw
    .trim()
    .split("\n")
    .map((line) => {
      const [word, answer] = line.split("|");
      return { word: word.trim(), answer: answer.trim() };
    });
}

function hashText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function buildQuestions(items) {
  const answers = [...new Set(items.map((item) => item.answer))];

  return items.map((item) => {
    const distractors = answers.filter((answer) => answer !== item.answer);
    const start = hashText(item.word) % distractors.length;
    const options = [item.answer];

    for (let offset = 0; options.length < 4 && offset < distractors.length; offset += 1) {
      const candidate = distractors[(start + offset) % distractors.length];
      if (!options.includes(candidate)) {
        options.push(candidate);
      }
    }

    const correct = hashText(`${item.word}-${item.answer}`) % options.length;
    const [answer] = options.splice(0, 1);
    options.splice(correct, 0, answer);

    return {
      word: item.word,
      correct,
      options
    };
  });
}

const vocabularyByLevel = {
  a1: makePairs(`
hello|hola
goodbye|adios
please|por favor
thanks|gracias
yes|si
no|no
man|hombre
woman|mujer
boy|nino
girl|nina
child|infante
friend|amigo
family|familia
mother|madre
father|padre
brother|hermano
sister|hermana
baby|bebe
name|nombre
home|hogar
house|casa
room|habitacion
door|puerta
window|ventana
table|mesa
chair|silla
bed|cama
sofa|sofa
lamp|lampara
floor|piso
wall|pared
roof|techo
kitchen|cocina
bathroom|bano
school|escuela
class|clase
teacher|maestro
student|estudiante
book|libro
page|pagina
pen|pluma
pencil|lapiz
bag|bolsa
phone|telefono
computer|computadora
screen|pantalla
car|auto
bus|autobus
train|tren
bike|bicicleta
street|calle
city|ciudad
park|parque
store|tienda
market|mercado
money|dinero
water|agua
milk|leche
coffee|cafe
tea|te
bread|pan
rice|arroz
egg|huevo
cheese|queso
meat|carne
fish|pescado
chicken|pollo
apple|manzana
banana|platano
orange|naranja
potato|papa
tomato|tomate
salt|sal
sugar|azucar
breakfast|desayuno
lunch|comida
dinner|cena
day|dia
night|noche
morning|manana
afternoon|tarde
evening|anochecer
today|hoy
tomorrow|manana futuro
yesterday|ayer
week|semana
month|mes
year|ano
time|tiempo
hour|hora
minute|minuto
one|uno
two|dos
three|tres
four|cuatro
five|cinco
six|seis
seven|siete
eight|ocho
nine|nueve
ten|diez
first|primero
last|ultimo
big|grande
small|pequeno
long|largo
short|corto
new|nuevo
old|viejo
young|joven
good|bueno
bad|malo
hot|caliente
cold|frio
warm|tibio
cool|fresco
happy|feliz
sad|triste
tired|cansado
sick|enfermo
hungry|hambriento
thirsty|sediento
fast|rapido
slow|lento
easy|facil
hard|dificil
right|derecho
left|izquierdo
near|cerca
far|lejos
open|abierto
closed|cerrado
red|rojo
blue|azul
green|verde
yellow|amarillo
black|negro
white|blanco
brown|marron
gray|gris
pink|rosa
purple|morado
dog|perro
cat|gato
bird|pajaro
horse|caballo
cow|vaca
pig|cerdo
mouse|raton
fish animal|pez
sun|sol
moon|luna
star|estrella
sky|cielo
rain|lluvia
snow|nieve
wind|viento
tree|arbol
flower|flor
grass|cesped
hand|mano
arm|brazo
leg|pierna
foot|pie
head|cabeza
face|cara
eye|ojo
ear|oreja
nose|nariz
mouth|boca
hair|cabello
heart|corazon
go|ir
come|venir
see|ver
look|mirar
hear|oir
listen|escuchar
speak|hablar
say|decir
read|leer
write|escribir
eat|comer
drink|beber
sleep|dormir
walk|caminar
run|correr
sit|sentarse
stand|pararse
buy|comprar
pay|pagar
have|tener
want|querer
need|necesitar
like|gustar
love|amar
play|jugar
work|trabajar
study|estudiar
live|vivir
`),
  a2: makePairs(`
about|acerca de
above|encima
across|a traves
address|direccion
advice|consejo
afraid|asustado
against|contra
airport|aeropuerto
almost|casi
already|ya
although|aunque
always|siempre
among|entre varios
answer|respuesta
anyone|cualquiera
anything|cualquier cosa
apartment|departamento
arrive|llegar
artist|artista
asleep|dormido
attend|asistir
autumn|otono
available|disponible
avoid|evitar
backpack|mochila
bank|banco
beach|playa
because|porque
become|volverse
before|antes
behind|detras
believe|creer
belong|pertenecer
below|debajo
between|entre dos
bicycle|bicicleta
blanket|cobija
borrow|pedir prestado
bring|traer
building|edificio
business|negocio
busy|ocupado
button|boton
calendar|calendario
camera|camara
careful|cuidadoso
carry|cargar
catch|atrapar
center|centro
chance|oportunidad
change|cambio
cheap|barato
choose|elegir
church|iglesia
circle|circulo
clean|limpio
climb|subir
cloud|nube
college|universidad
comfortable|comodo
company|empresa
compare|comparar
complete|completo
concert|concierto
corner|esquina
country|pais
course|curso
crowded|lleno de gente
customer|cliente
dangerous|peligroso
decide|decidir
deep|profundo
delicious|delicioso
describe|describir
different|diferente
difficult|dificil
direction|direccion rumbo
dirty|sucio
discount|descuento
disease|enfermedad
doctor|doctor
driver|conductor
during|durante
each|cada
early|temprano
earn|ganar dinero
education|educacion
either|cualquiera de dos
elevator|elevador
empty|vacio
enough|suficiente
entrance|entrada
environment|ambiente
especially|especialmente
even|incluso
event|evento
everywhere|en todas partes
excellent|excelente
except|excepto
excited|emocionado
expensive|caro
explain|explicar
factory|fabrica
famous|famoso
favorite|favorito
fever|fiebre
field|campo
finally|finalmente
flight|vuelo
foreign|extranjero
forget|olvidar
form|formulario
friendly|amable
future|futuro
garbage|basura
garden|jardin
guest|invitado
guide|guia
healthy|saludable
heavy|pesado
hill|colina
holiday|vacaciones
hotel|hotel
however|sin embargo
important|importante
improve|mejorar
inside|adentro
instead|en lugar de
interest|interes
invite|invitar
island|isla
journey|viaje largo
keyboard|teclado
language|idioma
later|despues
learn|aprender
leave|salir
lend|prestar
lesson|leccion
library|biblioteca
local|local
machine|maquina
manager|gerente
medicine|medicina
meeting|reunion
message|mensaje
mirror|espejo
modern|moderno
mountain|montana
museum|museo
necessary|necesario
neighbor|vecino
noise|ruido
office|oficina
opinion|opinion
opposite|opuesto
outside|afuera
passenger|pasajero
passport|pasaporte
patient|paciente
perfect|perfecto
perhaps|quizas
photograph|fotografia
planet|planeta
pleased|contento
pocket|bolsillo
police|policia
possible|posible
practice|practica
prefer|preferir
prepare|preparar
present|regalo
problem|problema
promise|promesa
quiet|silencioso
reason|razon
receipt|recibo
recent|reciente
recommend|recomendar
remember|recordar
repair|reparar
repeat|repetir
report|informe
restaurant|restaurante
return|regresar
safe|seguro
salary|salario
save|ahorrar
schedule|horario
search|buscar
season|temporada
secret|secreto
several|varios
share|compartir
shop assistant|dependiente
shoulder|hombro
similar|similar
simple|simple
since|desde
snack|botana
somewhere|en algun lugar
soon|pronto
special|especial
square|cuadrado
station|estacion
straight|recto
strange|extrano
successful|exitoso
suitcase|maleta
surprise|sorpresa
swimming pool|alberca
tablet|tableta
theater|teatro
ticket|boleto
together|juntos
traffic|trafico
travel|viajar
umbrella|paraguas
understand|entender
useful|util
visitor|visitante
waiter|mesero
weather|clima
without|sin
wonderful|maravilloso
`),
  a3: makePairs(`
ability|habilidad
abroad|en el extranjero
accept|aceptar
accident|accidente
according|segun
achieve|lograr
active|activo
actually|en realidad
advantage|ventaja
advertise|anunciar
affect|afectar
agreement|acuerdo
allow|permitir
amazing|asombroso
amount|cantidad
apologize|disculparse
appear|aparecer
application|solicitud
appointment|cita
argue|discutir
arrangement|arreglo
article|articulo
average|promedio
background|antecedente
balance|equilibrio
basic|basico
behavior|comportamiento
benefit|beneficio
border|frontera
branch|sucursal
brief|breve
career|carrera
challenge|reto
character|personaje
charge|cobrar
choice|eleccion
claim|afirmacion
coach|entrenador
collect|recolectar
common|comun
community|comunidad
condition|condicion
conference|conferencia
connect|conectar
consider|considerar
contain|contener
continue|continuar
contract|contrato
convenient|conveniente
conversation|conversacion
create|crear
culture|cultura
damage|dano
deal|trato
degree|grado
deliver|entregar
demand|demanda
department|departamento area
depend|depender
develop|desarrollar
difference|diferencia
direct|directo
disappear|desaparecer
discover|descubrir
discussion|debate
effort|esfuerzo
employee|empleado
employer|empleador
encourage|animar
energy|energia
engine|motor
enjoyable|agradable
enter|entrar
entire|entero
equipment|equipo
error|error
evidence|evidencia
experience|experiencia
expert|experto
fair|justo
fault|culpa
feature|caracteristica
female|femenino
figure|cifra
financial|financiero
focus|enfocarse
force|fuerza
freedom|libertad
fresh|fresco
function|funcion
generally|generalmente
government|gobierno
growth|crecimiento
habit|habito
handle|manejar
hardly|apenas
health|salud
hire|contratar
imagine|imaginar
immediate|inmediato
include|incluir
increase|aumentar
industry|industria
influence|influencia
instead of|en vez de
instruction|instruccion
international|internacional
interview|entrevista
introduce|presentar
involve|involucrar
knowledge|conocimiento
lawyer|abogado
leader|lider
least|menos
level|nivel
likely|probable
limit|limite
manage|gestionar
material|material
measure|medir
method|metodo
mistake|error
movement|movimiento
natural|natural
network|red
offer|oferta
opportunity|oportunidad
ordinary|ordinario
organization|organizacion
original|original
particular|particular
perform|realizar
personal|personal
physical|fisico
position|puesto
positive|positivo
powerful|poderoso
pressure|presion
previous|previo
process|proceso
produce|producir
professional|profesional
progress|progreso
property|propiedad
purpose|proposito
quality|calidad
raise|aumentar
rather|mas bien
reach|alcanzar
realize|darse cuenta
receive|recibir
reduce|reducir
refuse|rechazar
relationship|relacion
remain|permanecer
remove|quitar
replace|reemplazar
require|requerir
research|investigacion
resource|recurso
result|resultado
review|revision
routine|rutina
section|seccion
serious|serio
service|servicio
similarity|similitud
situation|situacion
skill|destreza
solution|solucion
source|fuente
specific|especifico
standard|estandar
statement|declaracion
strategy|estrategia
strength|fortaleza
structure|estructura
success|exito
support|apoyo
survey|encuesta
system|sistema
task|tarea
technology|tecnologia
term|termino
though|aunque
tool|herramienta
training|capacitacion
treat|tratar
trend|tendencia
typical|tipico
value|valor
variety|variedad
website|sitio web
whether|si condicional
wide|amplio
`),
};

const quizData = Object.fromEntries(
  Object.entries(vocabularyByLevel).map(([level, items]) => [level, buildQuestions(items)])
);

if (typeof window !== "undefined") {
  window.vocabularyByLevel = vocabularyByLevel;
  window.quizData = quizData;
}
