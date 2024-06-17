// router.js
document.addEventListener("DOMContentLoaded", () => {
    const navigateTo = url => {
        history.pushState(null, null, url);
        router();
    };

    const router = async () => {
        console.log(location.pathname);
        //debugger;
        const routes = [
            { path: "/", view: () => document.getElementById("home") },
            { path: "/notices", view: () => document.getElementById("notices") },
            { path: "/contact", view: () => document.getElementById("contact") },
        ];

        //Test each route for potential match
        const potentialMatches = routes.map(route => {
            return {
                route: route,
                isMatch: location.pathname === route.path
            };
        });

        let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);
        console.log(match);
        if (!match) {
            match = {
                route: routes[0],
                isMatch: true
            };
        }

       const sections = document.querySelectorAll(".section");
       sections.forEach(section => {
        if ("#" + section.id === section.id) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        });
        sections.forEach(section => section.style.display = 'none');

        const view = match.route.view();
        view.style.display = 'block';
    };

    window.addEventListener("popstate", router);

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});
