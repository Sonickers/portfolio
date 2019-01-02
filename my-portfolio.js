(($) => {
    $(function() {
        $.ajax({
            url: 'https://sonia-portfolio-api.herokuapp.com/insta',
            context: $('.js-drawings-container'),
            error: function() {
                $('.js-drawings-container').html('Problem fetching from api...');
            },
            timeout: 3000
        }).done(function(res) {
            const images = res.posts;
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

        images.forEach(({ caption, thumbnail_url, link }) => {
            const template = $('.js-drawing-template').clone();

            template.removeClass('js-drawing-template');
            template.find('img').attr('src', thumbnail_url);
            template.find('p').html(caption);
            template.find('a').attr('href', link);

            $('.js-drawings-container').append(template);
        });
    }
})($);