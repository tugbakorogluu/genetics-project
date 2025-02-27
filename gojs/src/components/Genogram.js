// import '../App.css';
import React, { Component } from "react";

import * as go from "gojs";
import { ReactDiagram } from "gojs-react";

var genoData;

function initDiagram() {
  const $ = go.GraphObject.make;
  // GoJS lisans anahtarını burada belirtiyoruz
  go.Diagram.licenseKey = "adsfewfwaefasdfdsfs";

  // GoJS diyagramını oluşturuyoruz
  const diagram = $(go.Diagram, {
    initialDocumentSpot: go.Spot.Bottom, // Diyagramın başlangıç konumunu belirler
    initialViewportSpot: go.Spot.Bottom, // Görüntüleme alanının başlangıç konumu
    "undoManager.isEnabled": true, // Geri alma (undo) işlemlerini etkinleştirir
    initialAutoScale: go.Diagram.Uniform, // Diyagramın otomatik ölçeklenmesini sağlar
    "clickCreatingTool.archetypeNodeData": {
      text: "new node",
      color: "lightblue",
    },
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key", // Bağlantılar için benzersiz bir anahtar belirlenmesi gerekir
    }),

    // Seçili düğümün etrafına bir süsleme (adornment) ekler
    nodeSelectionAdornmentTemplate: $(
      go.Adornment,
      "Auto",
      { layerName: "Grid" }, // Süslemeyi arka plana yerleştirir
      $(go.Shape, "Circle", { fill: "#c1cee3", stroke: null }),
      $(go.Placeholder, { margin: 2 }) // Seçili düğümün etrafına boşluk bırakır
    ),

    // Özel bir yerleşim düzeni kullanıyoruz
    layout: $(GenogramLayout, {
      direction: 90, // Düğümlerin yönünü 90 derece olarak ayarlar (dikey düzen)
      layerSpacing: 30, // Katmanlar arasındaki boşluğu ayarlar
      columnSpacing: 10, // Sütunlar arasındaki boşluğu ayarlar
    }),
  });

  // Düğümlerin dolgu rengini belirleyen fonksiyon
  function attrFill(a) {
    switch (a) {
      case "A":
        return "#00af54"; // Yeşil
      case "B":
        return "#f27935"; // Turuncu
      case "C":
        return "#d4071c"; // Kırmızı
      case "D":
        return "#70bdc2"; // Camgöbeği
      case "E":
        return "#fcf384"; // Altın sarısı
      case "F":
        return "#e69aaf"; // Pembe
      case "G":
        return "#08488f"; // Mavi
      case "H":
        return "#866310"; // Kahverengi
      case "I":
        return "#9270c2"; // Mor
      case "J":
        return "#a3cf62"; // Açık yeşil
      case "K":
        return "#91a4c2"; // Açık gri-mavi
      case "L":
        return "#af70c2"; // Eflatun
      case "S":
        return "#000000"; // Siyah
      case "M":
        return "#d4071c"; // Kırmızı
      default:
        return "transparent"; // Varsayılan olarak şeffaf
    }
  }

  // Özel şekiller tanımlıyoruz (Karelerin farklı konumları)
  var tlsq = go.Geometry.parse("F M1 1 l19 0 0 19 -19 0z"); // Sol üst kare
  var trsq = go.Geometry.parse("F M20 1 l19 0 0 19 -19 0z"); // Sağ üst kare
  var brsq = go.Geometry.parse("F M20 20 l19 0 0 19 -19 0z"); // Sağ alt kare
  var blsq = go.Geometry.parse("F M1 20 l19 0 0 19 -19 0z"); // Sol alt kare

  // Çapraz çizgi (üzeri çizili şekil)
  var slash = go.Geometry.parse(
    "F M38 0 L40 0 40 2 2 40 0 40 0 38z" + "F M40 38 L40 40 38 40 0 2 0 0 2 0z"
  );

  // Artı işareti (çapraz kare)
  var plus = go.Geometry.parse(
    "F M18 2 L20 0 22 2 22 38 20 40 18 38z" +
      "F M2 22 L0 20 2 18 38 18 40 20 38 22z"
  );

  // Erkek düğümleri için özel şekil belirleyen fonksiyon
  function maleGeometry(a) {
    switch (a) {
      case "A":
        return tlsq; // Sol üst kare
      case "B":
        return tlsq; // Sol üst kare
      case "C":
        return tlsq; // Sol üst kare
      case "D":
        return trsq; // Sağ üst kare
      case "E":
        return trsq; // Sağ üst kare
      case "F":
        return trsq; // Sağ üst kare
      case "G":
        return brsq; // Sağ alt kare
      case "H":
        return brsq; // Sağ alt kare
      case "I":
        return brsq; // Sağ alt kare
      case "J":
        return blsq; // Sol alt kare
      case "K":
        return blsq; // Sol alt kare
      case "L":
        return blsq; // Sol alt kare
      case "S":
        return slash; // Çapraz çizgi (üzeri çizili)
      case "M":
        return plus; // Artı işareti
      default:
        return tlsq; // Varsayılan olarak sol üst kare
    }
  }

  // Kadın düğümleri için özel şekiller tanımlanıyor (Kavisli şekiller)
  var tlarc = go.Geometry.parse("F M20 20 B 180 90 20 20 19 19 z"); // Sol üst yay
  var trarc = go.Geometry.parse("F M20 20 B 270 90 20 20 19 19 z"); // Sağ üst yay
  var brarc = go.Geometry.parse("F M20 20 B 0 90 20 20 19 19 z"); // Sağ alt yay
  var blarc = go.Geometry.parse("F M20 20 B 90 90 20 20 19 19 z"); // Sol alt yay

  // Kadın düğümleri için şekil belirleyen fonksiyon
  function femaleGeometry(a) {
    switch (a) {
      case "A":
      case "B":
      case "C":
        return tlarc; // Sol üst yay
      case "D":
      case "E":
      case "F":
        return trarc; // Sağ üst yay
      case "G":
      case "H":
      case "I":
        return brarc; // Sağ alt yay
      case "J":
      case "K":
      case "L":
        return blarc; // Sol alt yay
      case "S":
        return slash; // Çapraz çizgi (üzeri çizili)
      case "M":
        return plus; // Artı işareti
      default:
        return tlarc; // Varsayılan olarak sol üst yay
    }
  }

  // Erkek düğüm şablonunu oluşturuyoruz
  diagram.nodeTemplateMap.add(
    "M", // Erkek düğümü için tanımlama
    $(
      go.Node,
      "Vertical",
      {
        locationSpot: go.Spot.Center, // Düğümün merkezini konum noktası olarak belirler
        locationObjectName: "ICON",
        selectionObjectName: "ICON",
      },
      $(
        go.Panel,
        { name: "ICON" },
        $(go.Shape, "Square", {
          width: 40,
          height: 40,
          strokeWidth: 2,
          fill: "white",
          stroke: "#919191",
          portId: "", // Bağlantı noktası ID (varsayılan olarak boş)
        }),
        $(
          go.Panel,
          {
            // Erkek düğümler için renk ve şekil belirleme paneli
            itemTemplate: $(
              go.Panel,
              $(
                go.Shape,
                { stroke: null, strokeWidth: 0 },
                new go.Binding("fill", "", attrFill), // Renk bağlaması
                new go.Binding("geometry", "", maleGeometry) // Şekil bağlaması
              )
            ),
            margin: 1,
          },
          new go.Binding("itemArray", "a") // Düğümün niteliklerini alır
        )
      ),
      $(
        go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(80, NaN), editable: true },
        new go.Binding("text", "n") // Düğümün adını metin olarak bağlar
      )
    )
  );

  // Kadın düğüm şablonunu oluşturuyoruz
  diagram.nodeTemplateMap.add(
    "F", // Kadın düğümü için tanımlama
    $(
      go.Node,
      "Vertical",
      {
        locationSpot: go.Spot.Center, // Düğümün merkezini konum noktası olarak belirler
        locationObjectName: "ICON",
        selectionObjectName: "ICON",
      },
      $(
        go.Panel,
        { name: "ICON" },
        $(go.Shape, "Circle", {
          width: 40,
          height: 40,
          strokeWidth: 2,
          fill: "white",
          stroke: "#a1a1a1",
          portId: "",
        }),
        $(
          go.Panel,
          {
            // Kadın düğümler için renk ve şekil belirleme paneli
            itemTemplate: $(
              go.Panel,
              $(
                go.Shape,
                { stroke: null, strokeWidth: 0 },
                new go.Binding("fill", "", attrFill), // Renk bağlaması
                new go.Binding("geometry", "", femaleGeometry) // Şekil bağlaması
              )
            ),
            margin: 1,
          },
          new go.Binding("itemArray", "a") // Düğümün niteliklerini alır
        )
      ),
      $(
        go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(80, NaN), editable: true },
        new go.Binding("text", "n") // Düğümün adını metin olarak bağlar
      )
    )
  );

  diagram.nodeTemplateMap.add(
    "N", // "N" tipi düğüm (Düşük - Miscarriage)
    $(
      go.Node,
      "Vertical",
      {
        locationSpot: go.Spot.Center,
        locationObjectName: "ICON",
        selectionObjectName: "ICON",
      },
      $(
        go.Panel,
        { name: "ICON" },
        $(go.Shape, "Triangle", {
          width: 40,
          height: 40,
          strokeWidth: 2,
          fill: "white",
          stroke: "#a1a1a1",
          portId: "",
        }),
        $(
          go.Panel,
          {
            itemTemplate: $(
              go.Panel,
              $(
                go.Shape,
                { stroke: null, strokeWidth: 0 },
                new go.Binding("fill", "", attrFill),
                new go.Binding("geometry", "", femaleGeometry)
              )
            ),
            margin: 1,
          },
          new go.Binding("itemArray", "a")
        )
      ),
      $(
        go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(80, NaN), editable: true },
        new go.Binding("text", "n")
      )
    )
  );

  // Bağlantı etiketi için düğüm şablonu
  diagram.nodeTemplateMap.add(
    "LinkLabel",
    $(go.Node, {
      selectable: false,
      width: 1,
      height: 1,
      fromEndSegmentLength: 20,
    })
  );

  setupDiagram(diagram, genoData, 4 /* odaklanılacak kişi ID'si */);

  // Aile bireylerini bağlayan çizgilerin şablonu
  diagram.linkTemplate = $(
    go.Link,
    new go.Binding("routing", "routing"),
    {
      corner: 5,
      layerName: "Background",
      selectable: false,
      fromSpot: go.Spot.Bottom,
      toSpot: go.Spot.Top,
    },
    $(go.Shape, { stroke: "#424242", strokeWidth: 2 })
  );

  // Evlilik ilişkilerini gösteren bağlantı
  diagram.linkTemplateMap.add(
    "Marriage",
    $(
      go.Link,
      { selectable: false },
      $(go.Shape, { strokeWidth: 2.5, stroke: "#5d8cc1" /* mavi */ })
    )
  );

  // Basit düğüm şablonu
  diagram.nodeTemplate = $(
    go.Node,
    "Auto",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    $(
      go.Shape,
      "Rectangle",
      { name: "SHAPE", fill: "white", strokeWidth: 0 },
      new go.Binding("fill", "color")
    ),
    $(
      go.TextBlock,
      { margin: 8, editable: true },
      new go.Binding("text").makeTwoWay()
    )
  );

  return diagram;
}

// Şemayı başlatma fonksiyonu
function setupDiagram(diagram, array, focusId) {
  diagram.model = go.GraphObject.make(go.GraphLinksModel, {
    linkLabelKeysProperty: "labelKeys",
    nodeCategoryProperty: "s",
    copiesArrays: true,
    nodeDataArray: array,
    linkKeyProperty: "key",
  });
  setupMarriages(diagram);
  setupParents(diagram);

  var node = diagram.findNodeForKey(focusId);
  if (node !== null) {
    diagram.select(node);
  }
}

// İki kişi arasındaki evliliği bulma fonksiyonu
function findMarriage(diagram, a, b) {
  var nodeA = diagram.findNodeForKey(a);
  var nodeB = diagram.findNodeForKey(b);
  if (nodeA !== null && nodeB !== null) {
    var it = nodeA.findLinksBetween(nodeB);
    while (it.next()) {
      var link = it.value;
      if (link.data !== null && link.data.category === "Marriage") return link;
    }
  }
  return null;
}

// Evlilik ilişkilerini şemaya ekleyen fonksiyon
function setupMarriages(diagram) {
  var model = diagram.model;
  var nodeDataArray = model.nodeDataArray;
  for (var i = 0; i < nodeDataArray.length; i++) {
    var data = nodeDataArray[i];
    var key = data.key;
    var spouses = data.ux || data.vir;
    if (spouses !== undefined) {
      if (typeof spouses === "number") spouses = [spouses];
      for (var j = 0; j < spouses.length; j++) {
        var spouse = spouses[j];
        if (key === spouse) continue;
        var link = findMarriage(diagram, key, spouse);
        if (link === null) {
          var mlab = { s: "LinkLabel" };
          model.addNodeData(mlab);
          var mdata = {
            from: key,
            to: spouse,
            labelKeys: [mlab.key],
            category: "Marriage",
          };
          model.addLinkData(mdata);
        }
      }
    }
  }
}

// Ebeveyn-çocuk ilişkilerini şemaya ekleyen fonksiyon
function setupParents(diagram) {
  var model = diagram.model;
  var nodeDataArray = model.nodeDataArray;
  for (var i = 0; i < nodeDataArray.length; i++) {
    var data = nodeDataArray[i];
    var key = data.key;
    var mother = data.m;
    var father = data.f;
    var twin = data.t;
    if (mother !== undefined && father !== undefined) {
      var link = findMarriage(diagram, mother, father);
      if (link === null) {
        if (window.console)
          window.console.log("Bilinmeyen evlilik: " + mother + " & " + father);
        continue;
      }
      var mlabkey = link.data.labelKeys[0];
      var cdata = {
        from: mlabkey,
        to: key,
        routing: twin !== undefined ? go.Link.Normal : go.Link.Orthogonal,
      };
      diagram.model.addLinkData(cdata);
    }
  }
}

function GenogramLayout() {
  go.LayeredDigraphLayout.call(this);
  this.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
  this.spouseSpacing = 30; // Eşler arasındaki minimum boşluk
}
go.Diagram.inherit(GenogramLayout, go.LayeredDigraphLayout);

GenogramLayout.prototype.makeNetwork = function (coll) {
  // Ebeveyn-çocuk bağlantıları için LayoutEdges oluştur
  var net = this.createNetwork();
  if (coll instanceof go.Diagram) {
    this.add(net, coll.nodes, true);
    this.add(net, coll.links, true);
  } else if (coll instanceof go.Group) {
    this.add(net, coll.memberParts, false);
  } else if (coll.iterator) {
    this.add(net, coll.iterator, false);
  }
  return net;
};

// Eşleri temsil eden LayeredDigraphVertex nesneleri oluşturan yardımcı fonksiyon
GenogramLayout.prototype.add = function (net, coll, nonmemberonly) {
  var multiSpousePeople = new go.Set();
  var it = coll.iterator;
  while (it.next()) {
    var node = it.value;
    if (!(node instanceof go.Node)) continue;
    if (!node.isLayoutPositioned || !node.isVisible()) continue;
    if (nonmemberonly && node.containingGroup !== null) continue;

    if (node.isLinkLabel) {
      // Evlilik bağlantısını al
      var link = node.labeledLink;
      var spouseA = link.fromNode;
      var spouseB = link.toNode;
      // Eşleri temsil eden bir düğüm oluştur
      var vertex = net.addNode(node);
      vertex.width =
        spouseA.actualBounds.width +
        this.spouseSpacing +
        spouseB.actualBounds.width;
      vertex.height = Math.max(
        spouseA.actualBounds.height,
        spouseB.actualBounds.height
      );
      vertex.focus = new go.Point(
        spouseA.actualBounds.width + this.spouseSpacing / 2,
        vertex.height / 2
      );
    } else {
      var marriages = 0;
      node.linksConnected.each(function (l) {
        if (l.isLabeledLink) marriages++;
      });
      if (marriages === 0) {
        var vertex = net.addNode(node);
      } else if (marriages > 1) {
        multiSpousePeople.add(node);
      }
    }
  }

  // Bağlantıları işleme al
  it.reset();
  while (it.next()) {
    var link = it.value;
    if (!(link instanceof go.Link)) continue;
    if (!link.isLayoutPositioned || !link.isVisible()) continue;
    if (nonmemberonly && link.containingGroup !== null) continue;

    if (!link.isLabeledLink) {
      var parent = net.findVertex(link.fromNode);
      var child = net.findVertex(link.toNode);
      if (child !== null) {
        net.linkVertexes(parent, child, link);
      } else {
        link.toNode.linksConnected.each(function (l) {
          if (!l.isLabeledLink) return;
          var mlab = l.labelNodes.first();
          var mlabvert = net.findVertex(mlab);
          if (mlabvert !== null) {
            net.linkVertexes(parent, mlabvert, link);
          }
        });
      }
    }
  }

  while (multiSpousePeople.count > 0) {
    var node = multiSpousePeople.first();
    var cohort = new go.Set();
    this.extendCohort(cohort, node);

    var dummyvert = net.createVertex();
    net.addVertex(dummyvert);
    var marriages = new go.Set();
    cohort.each(function (n) {
      n.linksConnected.each(function (l) {
        marriages.add(l);
      });
    });
    marriages.each(function (link) {
      var mlab = link.labelNodes.first();
      var v = net.findVertex(mlab);
      if (v !== null) {
        net.linkVertexes(dummyvert, v, null);
      }
    });
    multiSpousePeople.removeAll(cohort);
  }
};

// Dolaylı olarak evli olan kişileri topla
GenogramLayout.prototype.extendCohort = function (coll, node) {
  if (coll.has(node)) return;
  coll.add(node);
  var lay = this;
  node.linksConnected.each(function (l) {
    if (l.isLabeledLink) {
      lay.extendCohort(coll, l.fromNode);
      lay.extendCohort(coll, l.toNode);
    }
  });
};

GenogramLayout.prototype.assignLayers = function () {
  go.LayeredDigraphLayout.prototype.assignLayers.call(this);
  var horiz = this.direction === 0.0 || this.direction === 180.0;

  var maxsizes = [];
  this.network.vertexes.each(function (v) {
    var lay = v.layer;
    var max = maxsizes[lay];
    if (max === undefined) max = 0;
    var sz = horiz ? v.width : v.height;
    if (sz > max) maxsizes[lay] = sz;
  });

  this.network.vertexes.each(function (v) {
    var lay = v.layer;
    var max = maxsizes[lay];
    if (horiz) {
      v.focus = new go.Point(0, v.height / 2);
      v.width = max;
    } else {
      v.focus = new go.Point(v.width / 2, 0);
      v.height = max;
    }
  });
};

// GenogramLayout sınıfının commitNodes fonksiyonu, düğüm konumlarını ayarlar.
GenogramLayout.prototype.commitNodes = function () {
  // LayeredDigraphLayout'in commitNodes fonksiyonunu çağırarak temel düğüm yerleşimini yapar
  go.LayeredDigraphLayout.prototype.commitNodes.call(this);

  // Normal düğümleri konumlandırma
  this.network.vertexes.each(function (v) {
    if (v.node !== null && !v.node.isLinkLabel) {
      v.node.position = new go.Point(v.x, v.y); // Düğüm pozisyonunu ayarla
    }
  });

  // Her evlilik düğümünün eşlerini konumlandırma
  var layout = this;
  this.network.vertexes.each(function (v) {
    if (v.node === null) return;
    if (!v.node.isLinkLabel) return; // Eğer düğüm bir etiketse
    var labnode = v.node;
    var lablink = labnode.labeledLink;

    // Evlilik bağlantısı etiketi düğümünü konumlandırma
    lablink.invalidateRoute();
    var spouseA = lablink.fromNode;
    var spouseB = lablink.toNode;

    // Babaların solda, annelerin sağda olmasını tercih et
    if (spouseA.data.s === "F") {
      var temp = spouseA;
      spouseA = spouseB;
      spouseB = temp; // Cinsiyet erkekse eşleri değiştir
    }

    // Ebeveynlerin istenilen tarafta olup olmadığını kontrol et
    var aParentsNode = layout.findParentsMarriageLabelNode(spouseA);
    var bParentsNode = layout.findParentsMarriageLabelNode(spouseB);
    if (
      aParentsNode !== null &&
      bParentsNode !== null &&
      aParentsNode.position.x > bParentsNode.position.x
    ) {
      var temp = spouseA;
      spouseA = spouseB;
      spouseB = temp; // Ebeveynlerin konumlarına göre eşleri yer değiştir
    }

    // Eşlerin pozisyonlarını ayarla
    spouseA.position = new go.Point(v.x, v.y);
    spouseB.position = new go.Point(
      v.x + spouseA.actualBounds.width + layout.spouseSpacing,
      v.y
    );

    // Opaklık sıfırsa, konumu ayarla
    if (spouseA.opacity === 0) {
      var pos = new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
      spouseA.position = pos;
      spouseB.position = pos;
    } else if (spouseB.opacity === 0) {
      var pos = new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
      spouseA.position = pos;
      spouseB.position = pos;
    }
  });

  // Sadece bir çocuğu olan düğümleri evlilik etiketi düğümünün altına yerleştir
  this.network.vertexes.each(function (v) {
    if (v.node === null || v.node.linksConnected.count > 1) return;
    var mnode = layout.findParentsMarriageLabelNode(v.node);
    if (mnode !== null && mnode.linksConnected.count === 1) {
      var mvert = layout.network.findVertex(mnode);
      var newbnds = v.node.actualBounds.copy();
      newbnds.x = mvert.centerX - v.node.actualBounds.width / 2;

      // Yeni alanı kontrol et, başka bir obje var mı?
      var overlaps = layout.diagram.findObjectsIn(
        newbnds,
        function (x) {
          return x.part;
        },
        function (p) {
          return p !== v.node;
        },
        true
      );
      if (overlaps.count === 0) {
        v.node.move(newbnds.position); // Alan boşsa, düğümü yeni pozisyona taşı
      }
    }
  });
};

// Ebeveynlerin evlilik etiket düğümünü bulma
GenogramLayout.prototype.findParentsMarriageLabelNode = function (node) {
  var it = node.findNodesInto();
  while (it.next()) {
    var n = it.value;
    if (n.isLinkLabel) return n; // Etiket düğümü bulundu
  }
  return null; // Etiket bulunamadıysa null döndür
};

// Model değişikliğini işleyen fonksiyon
function handleModelChange(e) {
  console.log(e); // Değişiklik bilgilerini konsola yazdır
}

// Genogram bileşeni
const Genogram = (props) => {
  genoData = props.Genogram; // Genogram verisini al

  return (
    <div id="genogram">
      <ReactDiagram
        initDiagram={initDiagram} // Diyagramı başlat
        divClassName="diagram-component"
        onModelChange={handleModelChange} // Model değişikliğini işleyen fonksiyonu ata
      />
    </div>
  );
};

export default Genogram; // Genogram bileşenini dışa aktar
