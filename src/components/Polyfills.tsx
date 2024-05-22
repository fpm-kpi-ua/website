export const Polyfills = () => (
	<script innerHTML="function lp(n){const s=document.createElement('script');s.src=`/polyfills/${n}.js`;s.defer=true;s.async=true;const l=document.createElement('link');l.rel='stylesheet';l.href=`/polyfills/${n}.css`;document.head.append(s,l);}if(!HTMLElement.prototype.hasOwnProperty('popover'))lp('popover');if(typeof HTMLDialogElement!=='function')lp('dialog');" />
);
