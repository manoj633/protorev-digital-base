const { animate, scroll, inView } = window.Motion;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.getElementById('customCursor');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    document.addEventListener('mousemove', (e) => {
        // Smooth cursor follow
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // 2. Navigation Scroll Effect
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3. Initial Hero Reveal
    animate('.fade-up', 
        { y: [40, 0], opacity: [0, 1] },
        { duration: 0.8, easing: [0.16, 1, 0.3, 1], delay: 0.1 }
    );

    // 4. Parallax Images on Scroll
    document.querySelectorAll('.parallax-img').forEach((img) => {
        scroll(
            animate(img, { y: ["-5%", "5%"] }),
            {
                target: img.parentElement,
                offset: ["start end", "end start"]
            }
        );
    });

    // 5. Scroll Reveal for Sections
    document.querySelectorAll('section .fade-up').forEach((el) => {
        // Extract original inline delay if present, else default
        const delayStr = el.style.transitionDelay || '0s';
        const delay = parseFloat(delayStr);
        el.style.transitionDelay = '0s'; // reset to let JS handle it cleanly or just rely on motion
        
        inView(el, (info) => {
            animate(el, 
                { y: [50, 0], opacity: [0, 1] }, 
                { duration: 0.8, easing: [0.16, 1, 0.3, 1], delay: delay }
            );
        }, { margin: "-50px" });
    });
});
