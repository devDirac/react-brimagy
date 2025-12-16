import _ from "lodash";
import { numericFormatter } from "react-number-format";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const fromFileToBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getErrorHttpMessage = (err: any) =>
  typeof err?.response !== "undefined" ? err?.response?.data?.message || "" : err?.message || "";

export const getLabels = (data: any) => _.uniq(_.map(data, "labels"));

const getColors = (key: number) => {
  const colores = {
    back: [
      "rgba(255, 66, 106, 0.2)",
      "rgba(23, 149, 235, 0.2)",
      "rgba(245, 187, 44, 0.2)",
      "rgba(25, 166, 166, 0.2)",
      "rgba(115, 49, 247, 0.2)",
      "rgba(247, 142, 37, 0.2)",
      "rgb(0,128,0,0.2)",

      "rgb(0,139,139)",
      "rgb(30,144,255)",
      "rgb(106,90,205)",
      "rgb(244,164,96)",
      "rgb(218,165,32)",
      "rgb(0,206,209)",
    ],
    border: [
      "rgba(230, 23, 67, 1)",
      "rgba(6, 124, 204, 1)",
      "rgba(237, 177, 28, 1)",
      "rgba(27, 92, 92, 1)",
      "rgba(72, 22, 171, 1)",
      "rgba(194, 103, 14, 1)",
      "rgb(5, 94, 5,1)",

      "rgb(47,79,79)",
      "rgb(25,25,112)",
      "rgb(72,61,139)",
      "rgb(139,69,19)",
      "rgb(184,134,11)",
      "rgb(0,139,139)",
    ],
  };
  return {
    bac: colores?.back?.[key],
    bor: colores?.border?.[key],
  };
};

export const getDataBarSimple = (data: any, rellena: any) => {
  const datos: any = {
    datasets: [],
  };
  if (_.isEmpty(data)) {
    return datos;
  }
  const columnasConsulta = Object.keys(data?.[0]);
  const columnasConsultaFiltradas = columnasConsulta.filter((e) => e !== "labels");
  columnasConsultaFiltradas.forEach((e: any, key_: number) => {
    const finalData: any = [];
    for (let i = 0; i < data.length; i++) {
      finalData.push(data[i]?.[e]);
    }
    datos.datasets.push({
      fill: rellena === 0 ? false : true,
      label: e,
      data: finalData,
      backgroundColor:
        columnasConsultaFiltradas?.length > 1
          ? getColors(key_)?.bac
          : [
              "rgba(255, 66, 106, 0.2)",
              "rgba(23, 149, 235, 0.2)",
              "rgba(245, 187, 44, 0.2)",
              "rgba(25, 166, 166, 0.2)",
              "rgba(115, 49, 247, 0.2)",
              "rgba(247, 142, 37, 0.2)",
            ],
      borderColor:
        columnasConsultaFiltradas?.length > 1
          ? getColors(key_)?.bor
          : [
              "rgba(230, 23, 67, 1)",
              "rgba(6, 124, 204, 1)",
              "rgba(237, 177, 28, 1)",
              "rgba(27, 92, 92, 1)",
              "rgba(72, 22, 171, 1)",
              "rgba(194, 103, 14, 1)",
            ],
      borderWidth: 1,
      tension: 0.6,
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 9,
    });
  });
  return datos;
};

export const getOptionsCHarts = (
  esVertical: boolean,
  esApilado: boolean,
  titulo: string,
  unidades: string
) => {
  const options = {
    ...(esVertical
      ? {
          indexAxis: "y" as const,
          elements: {
            bar: {
              borderWidth: 2,
            },
          },
        }
      : {}),
    ...{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: "index", // Muestra los datos de todas las categorías
          intersect: false, // Permite que el tooltip aparezca al pasar cerca de cualquier barra
          callbacks: {
            label: function (tooltipItem: any) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue} ${unidades}`;
            },
          },
        },
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: titulo,
        },
      },
    },
  };

  return {
    ...options,
    ...(esApilado
      ? {
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }
      : {}),
  };
};

export const initTasks = () => {
  const progres = 45;
  const currentDate = new Date();
  const tasks: any[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
      name: "Idea",
      id: "Task 0",
      progress: 45,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
      isDisabled: true,
      styles: {
        progressColor: progres < 50 ? "red" : progres > 50 && progres < 85 ? "yellow" : "green",
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2"],
      project: "ProjectSample",
      displayOrder: 6,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "milestone",
      dependencies: ["Task 4"],
      project: "ProjectSample",
      displayOrder: 7,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
  ];
  return tasks;
};

export const getStartEndDateForProject = (tasks: any[], projectId: string) => {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
};

export const getParameterValues = (param: any) => {
  var url = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
  for (var i = 0; i < url.length; i++) {
    var urlparam = url[i].split("=");
    if (urlparam[0] === param) {
      return urlparam[1];
    }
  }
};

export const agruparPor = (arreglo: any, propiedad: any) => {
  return arreglo.reduce((acumulador: any, objeto: any) => {
    const clave = objeto[propiedad];
    if (!acumulador[clave]) {
      acumulador[clave] = [];
    }
    acumulador[clave].push(objeto);
    return acumulador;
  }, {});
};

export const calcularDiferenciaPorcentual = (valor1: number, valor2: number) => {
  const mayor = Math.max(valor1, valor2);
  const menor = Math.min(valor1, valor2);
  const diferencia = ((mayor - menor) / mayor) * 100;
  return diferencia.toFixed(2);
};

export const formatNumericValues = (data: any) => {
  const numberFormatter = new Intl.NumberFormat("es-MX", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return data.map((record: any) => {
    Object.keys(record).forEach((key) => {
      const value = record[key];
      if (!isNaN(value) && value !== null && value !== "") {
        record[key] =
          key === "ano_registro" || key === "id" || key.includes("id_") || key.includes("_id")
            ? value
            : key.includes("importe") ||
              key.includes("amortizacion") ||
              key.includes("impuesto_iva") ||
              key.includes("saldo") ||
              key.includes("subtotal") ||
              key.includes("retencion")
            ? numericFormatter((value || 0) + "", {
                thousandSeparator: ",",
                decimalScale: 2,
                fixedDecimalScale: true,
                prefix: "$",
              })
            : numberFormatter.format(parseFloat(value));
      }
    });
    return record;
  });
};

export const isImageOrVideo = (items: any) => {
  // Extensiones comunes para imágenes y videos
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "flv", "wmv", "webm"];

  return items.map((item: any) => {
    // Extraer la extensión del archivo
    const extension = item.ruta_media.split(".").pop().toLowerCase();

    // Determinar el tipo de archivo
    if (imageExtensions.includes(extension)) {
      return { ...item, type: "image", duration: 30000 };
    } else if (videoExtensions.includes(extension)) {
      return { ...item, type: "video" };
    } else {
      return { ...item, type: "unknown" }; // Si no coincide con ninguna lista
    }
  });
};
