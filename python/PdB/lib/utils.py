def map_value(current_min: float,
              current_max: float,
              new_min: float,
              new_max: float,
              value: float
              ) -> float:
    return new_min + (
            (value - current_min)
            / (current_max - current_min)
            * (new_max - new_min)
    )