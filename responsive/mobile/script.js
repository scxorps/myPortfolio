// Mobile overrides: enforce autoplay and no controls, and disable interactivity.
(function(){
	function enforceNoControls(video){
		if(!video) return;
		try {
			video.removeAttribute('controls');
			video.controls = false;
			// Disable PiP and remote playback affordances where supported
			try { video.disablePictureInPicture = true; } catch(_) {}
			try { video.disableRemotePlayback = true; } catch(_) {}
			video.setAttribute('disablepictureinpicture','');
			video.setAttribute('controlsList','nodownload noplaybackrate nofullscreen noremoteplayback');
			// Ensure autoplay attrs are present
			video.setAttribute('muted','');
			video.muted = true;
			video.setAttribute('playsinline','');
			video.setAttribute('webkit-playsinline','');
			video.setAttribute('autoplay','');
		} catch(e) {}
	}

	function playIfActive(video){
		if(!video) return;
		const slide = video.closest('.swiper-slide');
		if(!slide) return;
		const isActive = slide.classList.contains('swiper-slide-active');
		if(isActive) {
			const p = video.play();
			if(p && typeof p.catch === 'function'){
				p.catch(()=>{});
			}
		} else {
			video.pause();
		}
	}

	function initMobileVideos(){
		const vids = document.querySelectorAll('.project-wrapper__image video');
		vids.forEach(v => {
			enforceNoControls(v);
			playIfActive(v);
		});
	}

	document.addEventListener('DOMContentLoaded', initMobileVideos);
	document.addEventListener('swiper:init', initMobileVideos);
	// Hook slide change via global Swiper if available
	document.addEventListener('swiper:slide-change', initMobileVideos);
})();
