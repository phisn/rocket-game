use bevy::prelude::*;

pub struct Gradient {
    entries: &'static [GradientEntry],
}

pub struct GradientEntry {
    pub time: f32,
    pub color: Color,
}

impl Gradient {
    pub const fn new(entries: &'static [GradientEntry]) -> Self {
        Self { entries }
    }

    pub fn pick_color(&self, time: f32) -> Color {
        if self.entries.len() == 1 {
            return self.entries[0].color;
        }

        if time <= self.entries[0].time {
            return self.entries[0].color;
        }

        for i in 0..self.entries.len() - 1 {
            if time >= self.entries[i].time && time <= self.entries[i + 1].time {
                let ratio = (time - self.entries[i].time)
                    / (self.entries[i + 1].time - self.entries[i].time);

                let left = self.entries[i].color;
                let right = self.entries[i + 1].color;

                return left + (right + left * -1.0) * ratio;
            }
        }

        self.entries[self.entries.len() - 1].color
    }
}
