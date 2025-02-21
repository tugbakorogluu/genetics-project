import React, { Component } from "react";

import * as go from "gojs";
import { ReactDiagram } from "gojs-react";

// Diyagramdaki model değişikliklerini konsola yazdırır
function handleModelChange(e) {
  console.log(e);
}

// Ana diyagram oluşturma ve özelliklerini ayarlama fonksiyonu
function initDiagram() {
  const $ = go.GraphObject.make;
  go.Diagram.licenseKey = "adsfewfwaefasdfdsfs";
  // Temel diyagram ayarları (geri alma özelliği ve otomatik ölçeklendirme)
  const diagram = $(
    go.Diagram,

    {
      "undoManager.isEnabled": true,
      initialAutoScale: go.Diagram.Uniform,
      ChangingSelection: false,
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
      }),
    }
  );

  // Özel şekiller için geometri tanımlamaları
  var tlarc = go.Geometry.parse("F M20 20 B 180 90 20 20 19 19 z");
  var trarc = go.Geometry.parse("F M20 20 B 270 90 20 20 19 19 z");
  var blarc = go.Geometry.parse("F M20 20 B 90 90 20 20 19 19 z");

  // İkiz bağlantıları için çizgi geometrileri
  var rLine = go.Geometry.parse("M -50 -95 l -50 -55");
  var lLine = go.Geometry.parse("M 50 -95 l 50 -55");

  // Başlık ekleme
  diagram.add(
    $(
      go.Part,
      "Vertical",
      { locationObjectName: "main", location: new go.Point(0, -50) },
      $(
        go.Panel,
        "Spot",
        $(go.TextBlock, "Symbol Definitions", {
          font: "30px sans-serif",
          position: new go.Point(150, 15),
        })
      )
    )
  );

  // Temel dikdörtgen sembol
  diagram.add(
    $(
      go.Part,
      "Vertical",
      { locationObjectName: "main", location: new go.Point(0, 0) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Rectangle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        })
      )
    )
  );

  // Sağ üst köşesi işaretli dikdörtgen
  diagram.add(
    $(
      go.Part,
      "Vertical",
      { locationObjectName: "main", location: new go.Point(0, 50) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Rectangle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, "Rectangle", {
          fill: "lightcoral",
          stroke: null,
          width: 20,
          height: 20,
          alignment: go.Spot.TopRight,
          alignmentFocus: go.Spot.TopRight,
        })
      )
    )
  );

  // Sol alt köşesi işaretli dikdörtgen
  diagram.add(
    $(
      go.Part,
      "Vertical",
      { locationObjectName: "main", location: new go.Point(0, 100) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Rectangle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, "Rectangle", {
          fill: "lightcoral",
          stroke: null,
          width: 20,
          height: 20,
          alignment: go.Spot.BottomLeft,
          alignmentFocus: go.Spot.BottomLeft,
        })
      )
    )
  );

  // Artı işaretli dikdörtgen
  diagram.add(
    $(
      go.Part,
      "Vertical",
      { locationObjectName: "main", location: new go.Point(0, 200) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Rectangle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, "PlusLine", {
          width: 40,
          height: 40,
          margin: 4,
          fill: null,
          stroke: "red",
        })
      )
    )
  );

  // X işaretli dikdörtgen
  diagram.add(
    $(
      go.Part,
      "Vertical",
      { locationObjectName: "main", location: new go.Point(0, 250) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Rectangle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, "XLine", { width: 40, height: 40, margin: 4, fill: null })
      )
    )
  );

  // Sol çizgili daire
  diagram.add(
    $(
      go.Part,
      "Vertical",
      { locationObjectName: "main", location: new go.Point(0, 350) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, {
          geometry: lLine,
          strokeWidth: 1,
          fill: null,
          stroke: "black",
        })
      )
    )
  );

  // Düşük sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(0, 400) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Triangle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, "XLine", { width: 35, height: 35, margin: 4, fill: null })
      ),
      $(go.TextBlock, "Miscarriage", {
        font: "12px sans-serif",
        position: new go.Point(150, 15),
      })
    )
  );

  // Erkek sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(0, 450) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Rectangle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        })
      ),
      $(go.TextBlock, "Male", {
        font: "12px sans-serif",
        position: new go.Point(150, 15),
      })
    )
  );

  // Kadın sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(0, 500) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        })
      ),
      $(go.TextBlock, "Female", {
        font: "12px sans-serif",
        position: new go.Point(150, 15),
      })
    )
  );

  // Kanser geçmişi olmayan sembol
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(100, 0) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        })
      ),
      $(go.TextBlock, "No Cancer History", {
        font: "12px sans-serif",
        position: new go.Point(50, 15),
      })
    )
  );

  // Tek taraflı meme kanseri sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(100, 50) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, {
          geometry: trarc,
          strokeWidth: 0,
          fill: "lightcoral",
          stroke: null,
          alignment: go.Spot.TopRight,
          alignmentFocus: go.Spot.TopRight,
        })
      ),
      $(go.TextBlock, "Breast Cancer \n (unilateral)", {
        font: "12px sans-serif",
        position: new go.Point(50, 10),
      })
    )
  );

  // Akciğer kanseri sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(100, 100) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, {
          geometry: blarc,
          strokeWidth: 0,
          fill: "lightcoral",
          stroke: null,
          alignment: go.Spot.BottomLeft,
          alignmentFocus: go.Spot.BottomLeft,
        })
      ),
      $(go.TextBlock, "Lung Cancer", {
        font: "12px sans-serif",
        position: new go.Point(50, 15),
      })
    )
  );

  // Yumurtalık kanseri sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(100, 150) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, {
          geometry: blarc,
          strokeWidth: 1,
          fill: "lightcoral",
          stroke: "lightcoral",
          alignment: go.Spot.BottomLeft,
          alignmentFocus: go.Spot.BottomLeft,
        }),
        $(go.Shape, {
          geometry: tlarc,
          strokeWidth: 1,
          fill: "lightcoral",
          stroke: "lightcoral",
          alignment: go.Spot.TopLeft,
          alignmentFocus: go.Spot.TopLeft,
        })
      ),
      $(go.TextBlock, "Ovarian Cancer", {
        font: "12px sans-serif",
        position: new go.Point(50, 15),
      })
    )
  );

  // Lenfoma/Lösemi sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(100, 200) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, "PlusLine", {
          width: 40,
          height: 40,
          margin: 4,
          fill: null,
          stroke: "red",
        })
      ),
      $(go.TextBlock, "Limphoma / leucemia", {
        font: "12px sans-serif",
        position: new go.Point(55, 18),
      })
    )
  );

  // Vefat sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(100, 250) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, "XLine", { width: 30, height: 30, margin: 4, fill: null })
      ),
      $(go.TextBlock, "Deceased", {
        font: "12px sans-serif",
        position: new go.Point(50, 18),
      })
    )
  );

  // İkiz kız çocukları sembolü
  diagram.add(
    $(
      go.Part,
      "Horizental",
      { locationObjectName: "main", location: new go.Point(100, 350) },
      $(
        go.Panel,
        "Spot",
        $(go.Shape, "Circle", {
          name: "main",
          fill: "white",
          stroke: null,
          width: 40,
          height: 40,
        }),
        $(go.Shape, {
          geometry: rLine,
          strokeWidth: 1,
          fill: null,
          stroke: "black",
        })
      ),
      $(go.TextBlock, "Twin Daughters", {
        font: "12px sans-serif",
        position: new go.Point(75, 70),
      })
    )
  );

  return diagram;
}

// Diyagramı gösteren React bileşeni
const Explain = () => {
  return (
    <div id="explain">
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-explain-component"
        onModelChange={handleModelChange}
      />
    </div>
  );
};

export default Explain;