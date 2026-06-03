document.addEventListener('DOMContentLoaded', () => {

    const navgBarToggle = document.querySelector('.navgBar-toggle');
    const navgBarContainer = document.querySelector('.navgBar-links-container');
    const navgBarLinks = document.querySelectorAll('.navgBar-link');
    const header = document.getElementById('navigationBar');

    if (navgBarToggle && navgBarContainer) {
        navgBarToggle.addEventListener('click', () => {
            document.body.classList.toggle('navgBar-open');
        });

        navgBarLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('navgBar-open');
            });
        });
    }


    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillProgressBars.forEach(bar => {
                        bar.style.width = bar.dataset.progress + '%';
                    });
                    observer.unobserve(skillsSection);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(skillsSection);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:myaseenmc@duck.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.open(mailtoLink, '_blank');
            contactForm.reset();
        });
    }

    const requestResumeBtn = document.getElementById('request-resume-btn');
    if (requestResumeBtn) {
        requestResumeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            setTimeout(function () {
                var subjectField = document.getElementById('subject');
                var messageField = document.getElementById('message');
                if (subjectField && messageField) {
                    subjectField.value = 'Resume Request';
                    messageField.value = 'Hi Muhammed, I would like to request a copy of your resume. Please send it to my email.';
                    subjectField.focus();
                }
            }, 600);
        });
    }

});
