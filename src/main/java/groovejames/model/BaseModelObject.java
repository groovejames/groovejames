package groovejames.model;

import org.apache.pivot.wtk.media.Image;

import static java.lang.Math.max;
import static java.lang.Math.min;

public abstract class BaseModelObject implements ImageObject, Scoreable {

    protected volatile Image image;
    protected volatile boolean loadingImage;
    protected Double score;
    protected double scorePercentage;
    protected Double popularity;
    protected double popularityPercentage;
    protected Long popularityIndex;

    @Override
    public abstract String getImageURL();

    @Override public Image getImage() {
        return image;
    }

    @Override public void setImage(Image image) {
        this.image = image;
    }

    @Override public boolean isLoadingImage() {
        return loadingImage;
    }

    @Override public void setLoadingImage(boolean loadingImage) {
        this.loadingImage = loadingImage;
    }

    @Override public Double getScore() {
        return score;
    }

    @Override public void setScore(Double score) {
        this.score = score;
    }

    @Override public double getScorePercentage() {
        return scorePercentage;
    }

    @Override public void setScorePercentage(double scorePercentage) {
        this.scorePercentage = max(min(scorePercentage, 1.0), 0.0);
    }

    @Override public Double getPopularity() {
        return popularity;
    }

    @Override public void setPopularity(Double popularity) {
        this.popularity = popularity;
    }

    @Override
    public Long getPopularityIndex() {
        return popularityIndex;
    }

    @Override
    public void setPopularityIndex(Long popularityIndex) {
        this.popularityIndex = popularityIndex;
    }

    @Override public double getPopularityPercentage() {
        return popularityPercentage;
    }

    @Override public void setPopularityPercentage(double popularityPercentage) {
        this.popularityPercentage = max(min(popularityPercentage, 1.0), 0.0);
    }

}
