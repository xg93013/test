import React, { Component } from 'react';
import ol from 'openlayers';
// import {
//   interaction, layer, custom, control, //name spaces
//   Interactions, Overlays, Controls,     //group
//   Map, Layers, Overlay, Util    //objects
// } from "react-openlayers";

export default class OlMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      olMap: '',
      olMarkerLayer: '',
      markerList: [],
      markerLayerArr: [],
      clickSelect: '',
      overlay: '',
      popWindow: false,
      selectName: ''
    }
  }
  componentDidMount() {
    this.initMap()
  }
  initMap() {
    let markerList = [{
      id: 1,
      name: 'a',
      geometry: [104.064760, 30.570200],
      color: "#999"
    },
    {
      id: 2,
      name: 'b',
      geometry: [104.064760, 30.570200],
      color: "#999"
    }]

    let [olMarkerLayer, olMap, overlay, clickSelect] = ['', '', '', ''];
    olMarkerLayer = new ol.layer.Vector({
      source: new ol.source.Vector()
    })
    olMap = new ol.Map({
      target: 'ol-map',
      layers: [
        // 底图
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        olMarkerLayer
      ],
      view: new ol.View({
        projection: 'EPSG:4326',
        center: [104.064760, 30.570200],
        zoom: 6
      })
    })
    overlay = new ol.Overlay({
      document: document.getElementById('popWindow'),
      autoPan: true,
      zIndex: 99,
      className: 'popWindow'
    })
    overlay.setPosition([104.064760, 30.570200])
    olMap.addOverlay(overlay)
    console.log(overlay)
    clickSelect = new ol.interaction.Select();
    clickSelect.on('select', (e) => {
      if (e.selected[0]) {
        console.log(overlay)
        console.log(e.selected[0].getGeometry().getCoordinates())
        console.log(e.selected[0].getProperties())
        overlay.setPosition(e.selected[0].getGeometry().getCoordinates())
        setTimeout(() => {
          olMap.addOverlay(overlay)
        }, 1000)
        // // olMap.addOverlay(overlay)
        // e.selected[0].setStyle(
        //   new ol.style.Style({
        //     image: new ol.style.Icon({
        //       anchor: [0.5, 1],
        //       opacity: 0.9,
        //       src: require("../../images/float-1-s.png")
        //     })
        //   })
        // )
        // this.setState({
        //   // popWindow: 
        //   selectName: e.selected[0].getProperties().name
        // })
      }
    })

    olMap.addInteraction(clickSelect)
    olMap.on('click', (e) => {
      if (!olMap.hasFeatureAtPixel(e.pixel)) {
        console.log(e)
        olMap.removeOverlay(overlay)
        return false
      }
    })
    olMap.on("pointermove", (event) => {
      olMap.getTargetElement().style.cursor = olMap.hasFeatureAtPixel(
        event.pixel
      )
        ? "pointer"
        : "";
    });
    this.setState({
      olMap: olMap,
      olMarkerLayer: olMarkerLayer,
      markerList: markerList,
      overlay: overlay
    })
    setTimeout(() => {
      this.addFeature()
    }, 20)

  }
  addFeature() {
    let { markerList, olMarkerLayer, markerLayerArr } = this.state;
    for (let i = 0; i < markerList.length; i++) {
      let marker = new ol.Feature({
        geometry: new ol.geom.Point(markerList[i].geometry),
        id: markerList[i].id,
        name: markerList[i].name
      })
      marker.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            opacity: 0.9,
            src: require("../../images/float-1-s.png")
          })
        })
      )
      markerLayerArr.push(marker);
      olMarkerLayer.getSource().addFeature(marker);
    }
    this.setState({
      markerLayerArr: markerLayerArr,
      olMarkerLayer: olMarkerLayer
    })
  }
  showPopup() {
    console.log('showpop');
  }
  render() {
    let { selectName } = this.state
    return (
      <div>
        <div className="title">ol</div>
        <div className="chart" id="ol-map" />
        {/* <Map view={{ center: [0, 0], zoom: 2 }} onClick={showPopup}>
          <Layers>
            <layer.Tile />
            <layer.Vector source={markers} style={markers.style} zIndex="1" />
          </Layers>
          <Overlays>
            <Overlay
              ref={comp => this.overlayComp = comp}
              element="#popup" />
          </Overlays>
          <Controls attribution={false} zoom={true}>
            <control.Rotate />
            <control.ScaleLine />
            <control.FullScreen />
            <control.OverviewMap />
            <control.ZoomSlider />
            <control.ZoomToExtent />
            <control.Zoom />
          </Controls>
          <Interactions>
            <interaction.Select style={selectedMarkerStyle} />
            <interaction.Draw source={markers} type='Point' />
            <interaction.Modify features={markers.features} />
          </Interactions>
        </Map>

        <custom.Popup ref={comp => this.popupComp = comp}>
        </custom.Popup> */}
        <div className="popWindow" style={{ width: "200px", height: "100px", background: '#fff', padding: "20px" }} id="popWindow">abcdtrtfdgdfg</div>
      </div>
    )
  }
}
