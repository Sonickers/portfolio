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
                        window.allImages = images;
                        displayImages(images.slice(0,6));
                        if (images.length > 6) {
                            $('.js-show-more-btn').show();
                        }
                        return false;
                    } else {
                        localStorage.clear();
                    }
                }
                return true;
            },
        }).done(function(res) {
            const images = res.graphql.user.edge_owner_to_timeline_media.edges.map((x) => x.node);
            window.allImages = images;
            displayImages(images.slice(0,6));

            if (images.length > 6) {
                $('.js-show-more-btn').show();
            }

            if (localStorage) {
                localStorage.setItem('insta-images', JSON.stringify(images));
                localStorage.setItem('insta-images-timestamp', Date.now());
            }
        });

        $(document).on('click', '.js-show-more-btn', function(e) {
            e.preventDefault();

            if (window.allImages !== undefined) {
                displayImages(window.allImages);
                $('.js-show-more-btn').remove();
            }
        });
    });

    function displayImages(images) {
        $('.js-drawings-container').html('');

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
