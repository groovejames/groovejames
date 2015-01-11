package groovejames.model;

public interface Scoreable {

    Double getScore();

    void setScore(Double score);

    double getScorePercentage();

    void setScorePercentage(double scorePercentage);

    Double getPopularity();

    void setPopularity(Double popularity);

    Long getPopularityIndex();

    void setPopularityIndex(Long popularityIndex);

    double getPopularityPercentage();

    void setPopularityPercentage(double popularityPercentage);

}
