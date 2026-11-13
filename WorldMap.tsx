'use client';
import { useEffect, useRef } from 'react';
import maplibregl, { Map as MlMap, Marker, LngLatBounds } from 'maplibre-gl';

type Point = { id:string; name:string; coordinates:[number,number]; similarity:number; selected?:boolean };
export default function WorldMap({ points, target, theme='dark' }: { points:Point[]; target?:[number,number]; theme?:'dark'|'light' }) {
  const el = useRef<HTMLDivElement>(null); const map = useRef<MlMap|null>(null); const markers = useRef<Marker[]>([]);
  useEffect(()=>{
    if (!el.current || map.current) return;
    const style = process.env.NEXT_PUBLIC_MAP_STYLE || `https://tiles.openfreemap.org/styles/${theme==='dark'?'dark':'positron'}`;
    const instance = new maplibregl.Map({container:el.current,style,center:target ?? [0,18],zoom:1.15, minZoom:1, maxZoom:15, attributionControl:true});
    map.current=instance;
    instance.addControl(new maplibregl.NavigationControl({showCompass:false}), 'top-right');
    const resize = () => instance.resize();
    instance.on('load', resize);
    const observer = new ResizeObserver(resize); observer.observe(el.current);
    instance.on('error', (event)=>console.warn('Foresight map tile/style error:', event.error ?? event));
    return ()=>{observer.disconnect();markers.current.forEach(m=>m.remove());instance.remove();map.current=null;};
  },[]);
  useEffect(()=>{
    if(map.current){const style=process.env.NEXT_PUBLIC_MAP_STYLE || `https://tiles.openfreemap.org/styles/${theme==='dark'?'dark':'positron'}`;map.current.setStyle(style);}
  },[theme]);
  useEffect(()=>{
    if (!map.current) return;
    markers.current.forEach(m=>m.remove()); markers.current=[];
    const add=(coordinates:[number,number], cls:string, label:string)=>{
      const node=document.createElement('div');node.className=cls;node.title=label;
      markers.current.push(new maplibregl.Marker({element:node}).setLngLat(coordinates).addTo(map.current!));
    };
    points.forEach(p=>add(p.coordinates,p.selected?'map-pin map-pin-selected':'map-pin',`${p.name} · ${p.similarity.toFixed(0)}% relative similarity`));
    if(target) add(target,'map-pin map-pin-origin','Selected target location');
    const coordinates=[...points.map(p=>p.coordinates),...(target?[target]:[])];
    if(map.current && coordinates.length>1){const bounds=coordinates.reduce((b,c)=>b.extend(c),new LngLatBounds(coordinates[0],coordinates[0]));map.current.fitBounds(bounds,{padding:48,maxZoom:2.7,duration:700});}
    else if(map.current && target){map.current.flyTo({center:target,zoom:3,duration:700});}
  },[points,target]);
  return <div className="map-shell"><div ref={el} className="world-map"/><div className="map-legend"><span><i className="legend-dot origin"/>Target</span><span><i className="legend-dot"/>Climate analogues</span></div><div className="map-caption">Global analogue locations · ranked candidate set</div></div>;
}
