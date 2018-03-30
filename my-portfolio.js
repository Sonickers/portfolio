(($) => {
    $(function() {
        $.ajax({
            url: 'https://www.instagram.com/sonia_ehm/?__a=1',
            context: $('.js-drawings-container'),
            beforeSend: function() {
                if (localStorage) {
                    const timestamp = +localStorage.getItem('insta-images-timestamp');
                    // Check if data is not older than half an hour, in ms
                    if (Date.now() - timestamp < 1800000) {
                        const images = JSON.parse(localStorage.getItem('insta-images'));
                        displayImages(images);
                        return false;
                    } else {
                        localStorage.clear();
                    }
                }
                return true;
            },
        }).done(function(res) {
            const images = res.graphql.user.edge_owner_to_timeline_media.edges.map((x) => x.node);
            displayImages(images);

            if (localStorage) {
                localStorage.setItem('insta-images', JSON.stringify(images));
                localStorage.setItem('insta-images-timestamp', Date.now());
            }
        });
    });

    function displayImages(images) {
        images.forEach((image) => {
            const thumbnail = image.thumbnail_src;
            const text = image.edge_media_to_caption.edges[0].node.text;
            const url = `https://www.instagram.com/p/${image.shortcode}`;
            const template = $('.js-drawing-template').clone();

            template.removeClass('js-drawing-template');
            template.find('img').attr('src', thumbnail);
            template.find('p').html(text);
            template.find('a').attr('href', url);

            $('.js-drawings-container').append(template);
        });
    }
})($);
