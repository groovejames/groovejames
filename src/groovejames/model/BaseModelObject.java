package groovejames.model;

import org.apache.pivot.wtk.media.Image;

import static java.lang.Math.max;
import static java.lang.Math.min;

public abstract class BaseModelObject implements ImageObject, Scoreable, Verifiable {

    protected volatile Image image;
    protected volatile boolean loadingImage;
    protected double score;
    protected double scorePercentage;
    protected double popularity;
    protected double popularityPercentage;
    protected boolean isVerified;

    @Override public abstract String getImageFilename();

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

    @Override public double getScore() {
        return score;
    }

    @Override public void setScore(double score) {
        this.score = score;
    }

    @Override public double getScorePercentage() {
        return scorePercentage;
    }

    @Override public void setScorePercentage(double scorePercentage) {
        this.scorePercentage = max(min(scorePercentage, 1.0), 0.0);
    }

    @Override public double getPopularity() {
        return popularity;
    }

    @Override public void setPopularity(double popularity) {
        this.popularity = popularity;
    }

    @Override public double getPopularityPercentage() {
        return popularityPercentage;
    }

    @Override public void setPopularityPercentage(double popularityPercentage) {
        this.popularityPercentage = max(min(popularityPercentage, 1.0), 0.0);
    }

    @Override public boolean getIsVerified() {
        return isVerified;
    }

    @Override public void setIsVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }
}
